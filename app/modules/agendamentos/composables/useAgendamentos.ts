/**
 * PROPÓSITO: Composable para buscar agendamentos do profissional atual com cache por semana
 * IMPORTA: useSupabaseClient, profissionalAtual, useAgendamentoStore, tipos de Agendamento
 * USADO_POR: Componentes que precisam listar agendamentos do profissional logado
 */

import { ref, watch } from 'vue'
import { useSupabaseClient } from '#imports'
import { profissionalAtual } from './profissionalAtual'
import { useAgendamentoStore } from '../stores/useAgendamentoStore'
import { useAuth } from '../../../shared/composables/useAuth'
import type { Agendamento } from '../types/agendamentos.types'

export const useAgendamentos = () => {
  const supabase = useSupabaseClient()
  const { userEspecialidade, fetchUserEspecialidade } = profissionalAtual()
  const agendamentoStore = useAgendamentoStore()
  const { user } = useAuth()

  // Estado reativo
  const agendamentos = ref<Agendamento[]>([])
  const loading = ref(false)
  const inserting = ref(false)
  const error = ref<string | null>(null)

  // Cache para armazenar agendamentos por semana (chave = timestamp do domingo da semana)
  const cacheSemanas = ref<Map<number, Agendamento[]>>(new Map())

  // Função auxiliar para obter a chave da semana (timestamp do domingo)
  const getChaveSemana = (dataReferencia: Date): number => {
    const data = new Date(dataReferencia)
    const diaSemana = data.getDay()
    const domingo = new Date(data)
    domingo.setDate(data.getDate() - diaSemana)
    domingo.setHours(0, 0, 0, 0) // Normalizar para início do dia
    return domingo.getTime()
  }

  // Função auxiliar para obter datas da semana
  const getDatasSemana = (dataReferencia: Date): Date[] => {
    const chaveSemana = getChaveSemana(dataReferencia)
    const domingo = new Date(chaveSemana)
    const datas = []
    for (let i = 0; i < 7; i++) {
      const dia = new Date(domingo)
      dia.setDate(domingo.getDate() + i)
      datas.push(dia)
    }
    return datas
  }

  // Função para buscar agendamentos de uma semana específica
  const fetchAgendamentosSemana = async (dataReferencia: Date): Promise<Agendamento[]> => {
    try {
      loading.value = true
      error.value = null

      // Garantir que os dados do profissional estejam carregados
      if (!userEspecialidade.value) {
        await fetchUserEspecialidade()
      }

      if (!userEspecialidade.value || !userEspecialidade.value.id) {
        error.value = 'Dados do profissional não disponíveis'
        return []
      }

      const profissionalId = userEspecialidade.value.id
      const chaveSemana = getChaveSemana(dataReferencia)
      const datasSemana = getDatasSemana(dataReferencia)

      // Formatar datas para consulta SQL (YYYY-MM-DD)
      const datasFormatadas = datasSemana.map(data => 
        data.toISOString().split('T')[0]
      )

      // Buscar agendamentos filtrados por semana
      const { data, error: fetchError } = await supabase
        .from('ag_agendamento')
        .select('*')
        .eq('profissional_id', profissionalId)
        .eq('cancelado', false)
        .in('data', datasFormatadas)
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (fetchError) throw fetchError

      const agendamentosSemana = data || []
      
      // Armazenar no cache
      cacheSemanas.value.set(chaveSemana, agendamentosSemana)

      return agendamentosSemana
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar agendamentos da semana:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Função para atualizar agendamentos da semana atual
  const fetchAgendamentos = async () => {
    const chaveSemanaAtual = getChaveSemana(agendamentoStore.dataReferencia)
    
    // Verificar se já está em cache
    if (cacheSemanas.value.has(chaveSemanaAtual)) {
      agendamentos.value = cacheSemanas.value.get(chaveSemanaAtual) || []
      return
    }

    // Buscar do banco se não estiver em cache
    const agendamentosSemana = await fetchAgendamentosSemana(agendamentoStore.dataReferencia)
    agendamentos.value = agendamentosSemana
  }

  // Função para editar agendamento existente
  const editarAgendamento = async (
    agendamentoId: number,
    dadosEdicao: {
      titulo: string
      descricao: string | null
      cor: string
    }
  ): Promise<Agendamento> => {
    try {
      loading.value = true
      error.value = null

      // Garantir que temos o user_id disponível
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }

      // Encontrar o agendamento atual no cache primeiro
      let agendamentoOriginal: Agendamento | null = null
      for (const [, agendamentosSemana] of cacheSemanas.value) {
        const encontrado = agendamentosSemana.find(ag => ag.id === agendamentoId)
        if (encontrado) {
          agendamentoOriginal = encontrado
          break
        }
      }

      if (!agendamentoOriginal) {
        throw new Error('Agendamento não encontrado')
      }

      // Preparar dados para atualização no banco
      const dadosParaAtualizacao = {
        titulo: dadosEdicao.titulo,
        descricao: dadosEdicao.descricao,
        cor: dadosEdicao.cor
      }

      // Atualizar no banco de dados
      const { error: updateError } = await (supabase
        .from('ag_agendamento') as any)
        .update(dadosParaAtualizacao)
        .eq('id', agendamentoId)

      if (updateError) throw updateError

      // Criar agendamento atualizado combinando dados originais com as alterações
      const agendamentoAtualizado: Agendamento = {
        ...agendamentoOriginal,
        titulo: dadosEdicao.titulo,
        descricao: dadosEdicao.descricao,
        cor: dadosEdicao.cor
      }

      // Atualizar cache local imediatamente para renderização
      const dataAgendamento = new Date(agendamentoAtualizado.data + 'T00:00:00')
      const chaveSemana = getChaveSemana(dataAgendamento)
      const chaveSemanaAtual = getChaveSemana(agendamentoStore.dataReferencia)
      
      // Atualizar no cache se a semana estiver carregada
      if (cacheSemanas.value.has(chaveSemana)) {
        const agendamentosDaSemana = [...(cacheSemanas.value.get(chaveSemana) || [])]
        const index = agendamentosDaSemana.findIndex(ag => ag.id === agendamentoId)
        
        if (index !== -1) {
          agendamentosDaSemana[index] = agendamentoAtualizado
          cacheSemanas.value.set(chaveSemana, agendamentosDaSemana)
          
          // Se é a semana atual exibida, atualizar agendamentos também
          if (chaveSemana === chaveSemanaAtual) {
            agendamentos.value = agendamentosDaSemana
          }
        }
      }

      return agendamentoAtualizado
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao editar agendamento:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Função para cancelar agendamento
  const cancelarAgendamento = async (agendamentoId: number): Promise<Agendamento> => {
    try {
      loading.value = true
      error.value = null

      // Garantir que temos o user_id disponível
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }

      // Encontrar o agendamento atual no cache primeiro
      let agendamentoOriginal: Agendamento | null = null
      for (const [, agendamentosSemana] of cacheSemanas.value) {
        const encontrado = agendamentosSemana.find(ag => ag.id === agendamentoId)
        if (encontrado) {
          agendamentoOriginal = encontrado
          break
        }
      }

      if (!agendamentoOriginal) {
        throw new Error('Agendamento não encontrado')
      }

      // Tentar usar função SQL para timezone de Brasília
      const { error: cancelError } = await (supabase as any).rpc('update_cancelado_agendamento', {
        agendamento_id: agendamentoId
      })
      
      let agendamentoCancelado: Agendamento
      
      if (cancelError) {
        // Se função não existir, usar método padrão
        console.warn('Função SQL não encontrada, usando método padrão')
        
        const agora = new Date().toISOString()
        const { error: updateError } = await (supabase
          .from('ag_agendamento') as any)
          .update({
            cancelado: true,
            cancelado_as: agora
          })
          .eq('id', agendamentoId)
          
        if (updateError) throw updateError
        
        agendamentoCancelado = {
          ...agendamentoOriginal,
          cancelado: true,
          cancelado_as: agora
        }
        
        console.log('⏰ Timestamp salvo (UTC):', agora)
      } else {
        // Função SQL executada com sucesso
        agendamentoCancelado = {
          ...agendamentoOriginal,
          cancelado: true,
          cancelado_as: new Date().toISOString() // Será sobrescrito pelo cache na próxima busca
        }
        
        console.log('✅ Função SQL executada - timezone de Brasília aplicado')
      }

      // Remover do cache local imediatamente (agendamentos cancelados não aparecem)
      const dataAgendamento = new Date(agendamentoCancelado.data + 'T00:00:00')
      const chaveSemana = getChaveSemana(dataAgendamento)
      const chaveSemanaAtual = getChaveSemana(agendamentoStore.dataReferencia)
      
      // Remover do cache se a semana estiver carregada
      if (cacheSemanas.value.has(chaveSemana)) {
        const agendamentosDaSemana = [...(cacheSemanas.value.get(chaveSemana) || [])]
        const agendamentosFiltrados = agendamentosDaSemana.filter(ag => ag.id !== agendamentoId)
        
        cacheSemanas.value.set(chaveSemana, agendamentosFiltrados)
        
        // Se é a semana atual exibida, atualizar agendamentos também
        if (chaveSemana === chaveSemanaAtual) {
          agendamentos.value = agendamentosFiltrados
        }
      }

      return agendamentoCancelado
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao cancelar agendamento:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Função para inserir novo agendamento
  const inserirAgendamento = async (dadosFormulario: {
    clienteId: number
    profissionalId: number
    data: string
    horaInicio: string
    horaFim: string
    titulo: string
    descricao: string | null
    cor: string
  }): Promise<Agendamento> => {
    // Guard para evitar chamadas duplas
    if (inserting.value) {
      throw new Error('Inserção já em andamento')
    }

    try {
      inserting.value = true
      loading.value = true
      error.value = null

      // Garantir que temos o user_id disponível
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }

      // Converter horários para o fuso horário de Brasília (-03:00)
      const horaInicioComTZ = `${dadosFormulario.horaInicio}:00-03:00`
      const horaFimComTZ = `${dadosFormulario.horaFim}:00-03:00`

      // Preparar dados para inserção no banco
      const dadosParaInsercao = {
        user_id: user.value.id,
        profissional_id: dadosFormulario.profissionalId,
        cliente_id: dadosFormulario.clienteId,
        data: dadosFormulario.data,
        hora_inicio: horaInicioComTZ,
        hora_fim: horaFimComTZ,
        titulo: dadosFormulario.titulo,
        descricao: dadosFormulario.descricao,
        cor: dadosFormulario.cor,
        cancelado: false
      }

      // Inserir no banco de dados
      const { data: novosAgendamentos, error: insertError } = await (supabase
        .from('ag_agendamento') as any)
        .insert(dadosParaInsercao)
        .select()

      if (insertError) throw insertError

      if (!novosAgendamentos || novosAgendamentos.length === 0) {
        throw new Error('Falha ao criar agendamento')
      }

      const novoAgendamento = novosAgendamentos[0]

      // Atualizar cache local imediatamente para renderização
      const dataAgendamento = new Date(dadosFormulario.data + 'T00:00:00')
      const chaveSemana = getChaveSemana(dataAgendamento)
      const chaveSemanaAtual = getChaveSemana(agendamentoStore.dataReferencia)
      
      // Se a semana já está em cache, adicionar o novo agendamento
      if (cacheSemanas.value.has(chaveSemana)) {
        const agendamentosDaSemana = [...(cacheSemanas.value.get(chaveSemana) || [])]
        agendamentosDaSemana.push(novoAgendamento)
        
        // Reordenar por data e hora
        agendamentosDaSemana.sort((a, b) => {
          const dataA = a.data || ''
          const dataB = b.data || ''
          if (dataA !== dataB) return dataA.localeCompare(dataB)
          
          const horaA = a.hora_inicio || ''
          const horaB = b.hora_inicio || ''
          return horaA.localeCompare(horaB)
        })
        
        cacheSemanas.value.set(chaveSemana, agendamentosDaSemana)
        
        // Se é a semana atual exibida, atualizar agendamentos também
        if (chaveSemana === chaveSemanaAtual) {
          agendamentos.value = agendamentosDaSemana
        }
      } else {
        // Se não está em cache e é a semana atual, fazer fetch para garantir consistência
        if (chaveSemana === chaveSemanaAtual) {
          // Invalidar cache da semana atual e recarregar
          cacheSemanas.value.delete(chaveSemanaAtual)
          await fetchAgendamentos()
        }
      }

      return novoAgendamento
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao inserir agendamento:', err)
      throw err
    } finally {
      inserting.value = false
      loading.value = false
    }
  }

  // Watcher para reagir às mudanças de semana
  watch(
    () => agendamentoStore.dataReferencia,
    async (novaDataReferencia) => {
      await fetchAgendamentos()
    },
    { immediate: false } // Não executar na inicialização
  )

  return {
    // Estado
    agendamentos,
    loading,
    inserting,
    error,
    cacheSemanas,

    // Actions
    fetchAgendamentos,
    fetchAgendamentosSemana,
    inserirAgendamento,
    editarAgendamento,
    cancelarAgendamento
  }
}
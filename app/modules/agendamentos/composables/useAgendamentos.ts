/**
 * PROPÓSITO: Composable para buscar agendamentos do profissional atual com cache por semana
 * IMPORTA: useSupabaseClient, profissionalAtual, useAgendamentoStore, tipos de Agendamento
 * USADO_POR: Componentes que precisam listar agendamentos do profissional logado
 */

import { ref, watch } from 'vue'
import { useSupabaseClient } from '#imports'
import { profissionalAtual } from './profissionalAtual'
import { useAgendamentoStore } from '../stores/useAgendamentoStore'
import type { Agendamento } from '../types/agendamentos.types'

export const useAgendamentos = () => {
  const supabase = useSupabaseClient()
  const { userEspecialidade, fetchUserEspecialidade } = profissionalAtual()
  const agendamentoStore = useAgendamentoStore()

  // Estado reativo
  const agendamentos = ref<Agendamento[]>([])
  const loading = ref(false)
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
    error,
    cacheSemanas,

    // Actions
    fetchAgendamentos,
    fetchAgendamentosSemana
  }
}
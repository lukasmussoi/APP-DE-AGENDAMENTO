/**
 * PROPÓSITO: Store unificado para gerenciamento de dados de relatórios de agendamentos completos
 * IMPORTA: defineStore do Pinia, useSupabaseClient
 * USADO_POR: Composables e componentes de relatórios
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Cliente } from '../../clientes/types/clientes.types'
import type { Profissional } from '../../profissionais/types/especialidade.types'

export interface AgendamentoCompleto {
  id: number
  created_at: string
  profissional_id: number
  cliente_id: number
  data: string
  hora_inicio: string
  hora_fim: string
  titulo: string
  descricao: string | null
  cancelado: boolean
  cor: string
  user_id: string
  cancelado_as: string | null
  cliente: {
    id: number
    cpf: string
    nome: string
    endereco: string
    email: string
    telefone: string
  }
  profissional: {
    id: number
    nome: string
    especialidade: string
    profile_id: number
    especialidade_id: number
    especialidades?: Array<{
      id: number
      nome: string
    }>
  }
  data_formatada: {
    dia: number
    mes: number
    ano: number
    hora_inicio: string
    hora_fim: string
  }
}

export interface FiltrosRelatorio {
  clienteId: string
  especialidadeId: string
  profissionalId: string
  dataInicio: string
  dataFim: string
  status: string // 'todos', 'ativos', 'cancelados'
}

export interface RpcResponseAgendamentosCompletos {
  success: boolean
  message: string
  data: AgendamentoCompleto[]
}

export const useRelatorioAgendamentosStore = defineStore('relatorioAgendamentos', () => {
  // Estado
  const agendamentosCompletos = ref<AgendamentoCompleto[]>([])
  const clientesAtivos = ref<Cliente[]>([])
  const profissionaisAtivos = ref<Profissional[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const dataLoaded = ref(false)

  // Filtros reativos
  const filtrosAtivos = ref<FiltrosRelatorio>({
    clienteId: '',
    especialidadeId: '',
    profissionalId: '',
    dataInicio: '',
    dataFim: '',
    status: 'todos'
  })

  // Computed para agendamentos filtrados
  const agendamentosFiltrados = computed(() => {
    if (!agendamentosCompletos.value || agendamentosCompletos.value.length === 0) {
      return []
    }

    return agendamentosCompletos.value.filter((agendamento: AgendamentoCompleto) => {
      // Filtro por cliente
      if (filtrosAtivos.value.clienteId && agendamento.cliente?.id !== parseInt(filtrosAtivos.value.clienteId)) {
        return false
      }

      // Filtro por profissional
      if (filtrosAtivos.value.profissionalId && agendamento.profissional?.id !== parseInt(filtrosAtivos.value.profissionalId)) {
        return false
      }

      // Filtro por especialidade
      if (filtrosAtivos.value.especialidadeId) {
        // Verificar se o profissional do agendamento tem a especialidade filtrada
        const profissionalTemEspecialidade = agendamento.profissional?.especialidade_id === parseInt(filtrosAtivos.value.especialidadeId)
        if (!profissionalTemEspecialidade) {
          return false
        }
      }

      // Filtro por data início
      if (filtrosAtivos.value.dataInicio) {
        const dataAgendamento = new Date(agendamento.data)
        const dataInicio = new Date(filtrosAtivos.value.dataInicio)
        if (dataAgendamento < dataInicio) {
          return false
        }
      }

      // Filtro por data fim
      if (filtrosAtivos.value.dataFim) {
        const dataAgendamento = new Date(agendamento.data)
        const dataFim = new Date(filtrosAtivos.value.dataFim)
        if (dataAgendamento > dataFim) {
          return false
        }
      }

      // Filtro por status (ativo/cancelado)
      if (filtrosAtivos.value.status !== 'todos') {
        const isCancelado = agendamento.cancelado || false
        if (filtrosAtivos.value.status === 'ativos' && isCancelado) {
          return false
        }
        if (filtrosAtivos.value.status === 'cancelados' && !isCancelado) {
          return false
        }
      }

      return true
    })
  })

  // Computed para especialidades únicas
  const especialidadesUnicas = computed(() => {
    if (!profissionaisAtivos.value || profissionaisAtivos.value.length === 0) {
      return []
    }

    const especialidadesMap = new Map()

    profissionaisAtivos.value.forEach((profissional) => {
      // Cada profissional tem especialidade_id e especialidade (nome)
      if (profissional.especialidade_id && profissional.especialidade) {
        if (!especialidadesMap.has(profissional.especialidade_id)) {
          especialidadesMap.set(profissional.especialidade_id, {
            id: profissional.especialidade_id,
            nome: profissional.especialidade
          })
        }
      }
    })

    return Array.from(especialidadesMap.values()).sort((a, b) => a.nome.localeCompare(b.nome))
  })

  // Computed para profissionais filtrados por especialidade
  const profissionaisFiltrados = computed(() => {
    if (!profissionaisAtivos.value || profissionaisAtivos.value.length === 0) {
      return []
    }

    if (!filtrosAtivos.value.especialidadeId) {
      return profissionaisAtivos.value
    }

    return profissionaisAtivos.value.filter((profissional) => {
      return profissional.especialidade_id === parseInt(filtrosAtivos.value.especialidadeId)
    })
  })

  // Ações
  const fetchAgendamentosCompletos = async () => {
    const supabase = useSupabaseClient()

    console.log('fetchAgendamentosCompletos chamado')

    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase.rpc('ag_listar_agendamentos_completo') as { data: any, error: any }

      console.log('Resposta da RPC:', data)

      if (fetchError) {
        error.value = fetchError.message
        console.error('Erro ao buscar agendamentos completos:', fetchError)
        return
      }

      // Processar o retorno da RPC
      let response: RpcResponseAgendamentosCompletos | null = null

      if (Array.isArray(data) && data.length > 0) {
        // Se é array, pode ser data[0]['ag_listar_agendamentos_completo'] ou data[0] diretamente
        if (data[0]['ag_listar_agendamentos_completo']) {
          response = data[0]['ag_listar_agendamentos_completo'] as RpcResponseAgendamentosCompletos
        } else {
          response = data[0] as RpcResponseAgendamentosCompletos
        }
      } else if (data && typeof data === 'object') {
        // Se é objeto, pode ser data['ag_listar_agendamentos_completo'] ou data diretamente
        if (data['ag_listar_agendamentos_completo']) {
          response = data['ag_listar_agendamentos_completo'] as RpcResponseAgendamentosCompletos
        } else {
          response = data as RpcResponseAgendamentosCompletos
        }
      }

      console.log('Response processada:', response)

      if (response && response.success) {
        agendamentosCompletos.value = response.data || []
        console.log('Agendamentos armazenados:', agendamentosCompletos.value.length)
      } else if (response) {
        error.value = response.message || 'Erro ao processar resposta da RPC'
      } else {
        // Se não conseguiu parsear, assumir array vazio
        agendamentosCompletos.value = []
        console.log('Nenhum dado encontrado')
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar agendamentos completos:', err)
    } finally {
      loading.value = false
      console.log('Loading finalizado')
    }
  }

  const fetchClientesAtivos = async () => {
    try {
      const supabase = useSupabaseClient()
      const { data, error: fetchError } = await supabase.from('ag_clientes').select('*')
      if (fetchError) throw fetchError
      clientesAtivos.value = data || []
      console.log('Clientes ativos carregados:', clientesAtivos.value.length)
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar clientes ativos:', err)
    }
  }

  const fetchProfissionaisAtivos = async () => {
    try {
      console.log('Iniciando carregamento de profissionais via RPC...')

      const supabase = useSupabaseClient()
      const { data, error: rpcError } = await supabase.rpc('ag_listar_profissionais_admin') as { data: any, error: any }

      console.log('Resposta da RPC ag_listar_profissionais_admin:', data)
      console.log('Erro da RPC:', rpcError)

      if (rpcError) throw rpcError

      // Processar o retorno da RPC - tentar diferentes estruturas possíveis
      let response: any = null

      if (Array.isArray(data) && data.length > 0) {
        // Se é array, pode ser data[0]['ag_listar_profissionais_admin'] ou data[0] diretamente
        if (data[0]['ag_listar_profissionais_admin']) {
          response = data[0]['ag_listar_profissionais_admin']
        } else {
          response = data[0]
        }
      } else if (data && typeof data === 'object') {
        // Se é objeto, pode ser data['ag_listar_profissionais_admin'] ou data diretamente
        if (data['ag_listar_profissionais_admin']) {
          response = data['ag_listar_profissionais_admin']
        } else {
          response = data
        }
      }

      console.log('Response processada:', response)

      if (response && response.success) {
        profissionaisAtivos.value = response.data || []
        console.log('Profissionais ativos carregados:', profissionaisAtivos.value.length)
        console.log('Dados dos profissionais:', profissionaisAtivos.value)
      } else if (response) {
        throw new Error(response.message || 'Erro ao buscar profissionais')
      } else {
        // Se não conseguiu parsear, assumir array vazio
        profissionaisAtivos.value = []
        console.warn('Não foi possível parsear a resposta da RPC:', data)
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar profissionais ativos:', err)
    }
  }

  const carregarDadosRelatorio = async () => {
    console.log('Iniciando carregamento de dados para relatórios...')

    try {
      loading.value = true
      error.value = null

      // Carregar agendamentos, clientes e profissionais em paralelo
      await Promise.all([
        fetchAgendamentosCompletos(),
        fetchClientesAtivos(),
        fetchProfissionaisAtivos()
      ])

      // Marcar que os dados foram carregados
      dataLoaded.value = true

      console.log('Dados para relatórios carregados com sucesso:', {
        agendamentos: agendamentosCompletos.value.length,
        clientes: clientesAtivos.value.length,
        profissionais: profissionaisAtivos.value.length
      })
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao carregar dados do relatório:', err)
    } finally {
      loading.value = false
    }
  }

  const aplicarFiltros = (novosFiltros: FiltrosRelatorio) => {
    filtrosAtivos.value = { ...novosFiltros }
  }

  const limparFiltros = () => {
    filtrosAtivos.value = {
      clienteId: '',
      especialidadeId: '',
      profissionalId: '',
      dataInicio: '',
      dataFim: '',
      status: 'todos'
    }
  }

  return {
    // Estado
    agendamentosCompletos,
    clientesAtivos,
    profissionaisAtivos,
    loading,
    error,
    dataLoaded,
    filtrosAtivos,

    // Computed
    agendamentosFiltrados,
    especialidadesUnicas,
    profissionaisFiltrados,

    // Ações
    fetchAgendamentosCompletos,
    fetchClientesAtivos,
    fetchProfissionaisAtivos,
    carregarDadosRelatorio,
    aplicarFiltros,
    limparFiltros
  }
})
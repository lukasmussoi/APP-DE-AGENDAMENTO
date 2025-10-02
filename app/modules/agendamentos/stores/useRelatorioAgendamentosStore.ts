/**
 * PROPÓSITO: Store para gerenciamento de dados de relatórios de agendamentos completos
 * IMPORTA: defineStore do Pinia, useSupabaseClient
 * USADO_POR: Composables e componentes de relatórios
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

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
  }
  data_formatada: {
    dia: number
    mes: number
    ano: number
    hora_inicio: string
    hora_fim: string
  }
}

export interface RpcResponseAgendamentosCompletos {
  success: boolean
  message: string
  data: AgendamentoCompleto[]
}

export const useRelatorioAgendamentosStore = defineStore('relatorioAgendamentos', () => {
  // Estado
  const agendamentosCompletos = ref<AgendamentoCompleto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

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

  return {
    // Estado
    agendamentosCompletos,
    loading,
    error,

    // Ações
    fetchAgendamentosCompletos
  }
})
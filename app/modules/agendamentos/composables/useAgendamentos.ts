/**
 * PROPÓSITO: Composable para buscar agendamentos do profissional atual
 * IMPORTA: useSupabaseClient, profissionalAtual, tipos de Agendamento
 * USADO_POR: Componentes que precisam listar agendamentos do profissional logado
 */

import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import { profissionalAtual } from './profissionalAtual'
import type { Agendamento } from '../types/agendamentos.types'

export const useAgendamentos = () => {
  const supabase = useSupabaseClient()
  const { userEspecialidade, fetchUserEspecialidade } = profissionalAtual()

  // Estado reativo
  const agendamentos = ref<Agendamento[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Função para buscar agendamentos
  const fetchAgendamentos = async () => {
    try {
      loading.value = true
      error.value = null

      // Garantir que os dados do profissional estejam carregados
      if (!userEspecialidade.value) {
        await fetchUserEspecialidade()
      }

      if (!userEspecialidade.value || !userEspecialidade.value.id) {
        error.value = 'Dados do profissional não disponíveis'
        return
      }

      const profissionalId = userEspecialidade.value.id

      // Buscar agendamentos filtrados
      const { data, error: fetchError } = await supabase
        .from('ag_agendamento')
        .select('*')
        .eq('profissional_id', profissionalId)
        .eq('cancelado', false)
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (fetchError) throw fetchError

      agendamentos.value = data || []
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar agendamentos:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    agendamentos,
    loading,
    error,

    // Actions
    fetchAgendamentos
  }
}
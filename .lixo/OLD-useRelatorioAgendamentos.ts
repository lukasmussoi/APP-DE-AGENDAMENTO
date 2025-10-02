/**
 * PROPÓSITO: Composable para acessar dados de relatórios de agendamentos completos
 * IMPORTA: useRelatorioAgendamentosStore
 * USADO_POR: Componentes de relatórios
 */

import { useRelatorioAgendamentosStore } from '../stores/useRelatorioAgendamentosStore'

export const useRelatorioAgendamentos = () => {
  const store = useRelatorioAgendamentosStore()

  // Função para listar agendamentos completos
  const listarAgendamentosCompletos = async () => {
    await store.fetchAgendamentosCompletos()
    return store.agendamentosCompletos
  }

  return {
    // Estado
    agendamentosCompletos: store.agendamentosCompletos,
    loading: store.loading,
    error: store.error,

    // Ações
    listarAgendamentosCompletos
  }
}
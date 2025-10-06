/**
 * PROPÓSITO: Composable simplificado que delega para o store Pinia
 * IMPORTA: useRelatorioAgendamentosStore
 * USADO_POR: RelatorioContainer.vue (para compatibilidade)
 */

import { useRelatorioAgendamentosStore } from '../stores/useRelatorioAgendamentosStore'

export const useRelatorioDados = () => {
  const store = useRelatorioAgendamentosStore()

  return {
    // Delegar tudo para o store
    ...store,

    // Alias para compatibilidade
    listarAgendamentosCompletos: store.fetchAgendamentosCompletos,
    carregarDadosRelatorio: store.carregarDadosRelatorio
  }
}
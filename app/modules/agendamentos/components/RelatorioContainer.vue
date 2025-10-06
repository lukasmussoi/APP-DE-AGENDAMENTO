/**
 * PROPÓSITO: Componente pai invisível para carregar e armazenar dados de relatórios de agendamentos
 * IMPORTA: useRelatorioAgendamentosStore
 * USADO_POR: Páginas de relatórios
 */

<template>
  <div class="w-full min-h-screen border-2 border-dashed border-gray-300">
    <!-- Header/Topo - contém o componente de filtro -->
    <div class="relatorio-header">
      <RelatorioFiltro />
    </div>

    <!-- Corpo - contém o componente RelatorioCards -->
    <div class="relatorio-body">
      <!-- ClientOnly para evitar hydration mismatch -->
      <ClientOnly>
        <!-- Só renderiza o componente quando os dados estiverem carregados -->
        <RelatorioCards v-if="dataLoaded" />

        <!-- Loading state enquanto carrega -->
        <div v-else class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span class="ml-3 text-gray-600">Carregando dados do relatório...</span>
        </div>

        <!-- Fallback para SSR -->
        <template #fallback>
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-gray-600">Preparando relatório...</span>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar componentes
import RelatorioCards from './RelatorioCards.vue'
import RelatorioFiltro from './RelatorioFiltro.vue'

// Importar store do Pinia
import { useRelatorioAgendamentosStore } from '../stores/useRelatorioAgendamentosStore'

// Usar o store diretamente
const store = useRelatorioAgendamentosStore()

// Expor dados para componentes filhos via provide
provide('relatorioStore', store)

// Computed para acessar dataLoaded do store
const dataLoaded = computed(() => store.dataLoaded)

// Carregar dados ao montar o componente
onMounted(async () => {
  if (!store.dataLoaded) {
    await store.carregarDadosRelatorio()
  }
})
</script>
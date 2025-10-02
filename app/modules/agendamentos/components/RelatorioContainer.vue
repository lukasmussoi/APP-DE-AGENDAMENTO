/**
 * PROPÓSITO: Componente pai invisível para carregar e armazenar dados de relatórios de agendamentos
 * IMPORTA: useRelatorioAgendamentos
 * USADO_POR: Páginas de relatórios
 */

<template>
  <div class="w-full min-h-screen border-2 border-dashed border-gray-300">
    <!-- Header/Topo - vazio por enquanto -->
    <div class="relatorio-header">
      <!-- Espaço reservado para header do relatório -->
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

// Importar composable de relatórios
import { useRelatorioAgendamentos } from '../composables/useRelatorioAgendamentos'
import { useRelatorioDados } from '../composables/useRelatorioDados'

// Usar os composables para carregar dados
const { agendamentosCompletos, loading: loadingAgendamentos, error: errorAgendamentos, listarAgendamentosCompletos } = useRelatorioAgendamentos()
const { clientesAtivos, profissionaisAtivos, loading: loadingDados, error: errorDados, carregarDadosRelatorio } = useRelatorioDados()

// Estado para controlar se os dados foram carregados
const dataLoaded = ref(false)

// Flag para evitar múltiplas execuções do carregamento
const isLoading = ref(false)

// Dados para provide
const providedData = reactive({
  agendamentosCompletos,
  loading: computed(() => loadingAgendamentos || loadingDados),
  error: computed(() => errorAgendamentos || errorDados),
  clientesAtivos,
  profissionaisAtivos,
  dataLoaded
})

// Expor dados para componentes filhos via provide
provide('relatorioData', providedData)

// Função para carregar dados (reutilizável)
const carregarDados = async () => {
  // Evitar múltiplas execuções simultâneas
  if (isLoading.value) {
    console.log('Carregamento já em andamento, ignorando nova solicitação')
    return
  }

  console.log('RelatorioContainer iniciando carregamento de dados...')
  isLoading.value = true

  try {
    // Carregar agendamentos e dados auxiliares em paralelo
    await Promise.all([
      listarAgendamentosCompletos(),
      carregarDadosRelatorio()
    ])

    // Marcar que os dados foram carregados
    dataLoaded.value = true

    console.log('Dados de relatórios carregados:', {
      agendamentos: agendamentosCompletos.length,
      clientes: clientesAtivos.value.length,
      profissionais: profissionaisAtivos.value.length
    })
    console.log('Provide executado com dados após carregamento')
  } catch (err) {
    console.error('Erro ao carregar dados do relatório:', err)
    // Mesmo com erro, marcar como carregado para mostrar o estado de erro
    dataLoaded.value = true
  } finally {
    isLoading.value = false
  }
}

// Carregar dados ao montar o componente
onMounted(() => {
  // Só carregar se ainda não tiver dados ou se não estiver carregando
  if (!dataLoaded.value && !isLoading.value) {
    carregarDados()
  }
})
</script>
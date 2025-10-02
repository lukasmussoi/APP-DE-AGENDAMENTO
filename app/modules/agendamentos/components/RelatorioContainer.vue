/**
 * PROPÓSITO: Componente pai invisível para carregar e armazenar dados de relatórios de agendamentos
 * IMPORTA: useRelatorioAgendamentos
 * USADO_POR: Páginas de relatórios
 */

<template>
  <div class="w-full min-h-screen border-2 border-dashed border-gray-300">
    <!-- Slot para componentes filhos -->
    <slot />
  </div>
</template>

<script setup lang="ts">
// Importar composable de relatórios
import { useRelatorioAgendamentos } from '../composables/useRelatorioAgendamentos'
import { useRelatorioDados } from '../composables/useRelatorioDados'

// Usar os composables para carregar dados
const { agendamentosCompletos, loading: loadingAgendamentos, error: errorAgendamentos, listarAgendamentosCompletos } = useRelatorioAgendamentos()
const { clientesAtivos, profissionaisAtivos, loading: loadingDados, error: errorDados, carregarDadosRelatorio } = useRelatorioDados()

// Dados para provide
const providedData = reactive({
  agendamentosCompletos,
  loading: computed(() => loadingAgendamentos || loadingDados),
  error: computed(() => errorAgendamentos || errorDados),
  clientesAtivos,
  profissionaisAtivos
})

// Expor dados para componentes filhos via provide
provide('relatorioData', providedData)

// Carregar dados ao montar o componente
onMounted(async () => {
  console.log('RelatorioContainer montado, carregando dados...')

  // Carregar agendamentos e dados auxiliares em paralelo
  await Promise.all([
    listarAgendamentosCompletos(),
    carregarDadosRelatorio()
  ])

  console.log('Dados de relatórios carregados:', {
    agendamentos: agendamentosCompletos.length,
    clientes: clientesAtivos.value.length,
    profissionais: profissionaisAtivos.value.length
  })
  console.log('Provide executado com dados após carregamento')
})
</script>
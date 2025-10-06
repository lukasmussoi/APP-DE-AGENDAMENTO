/**
 * PROPÓSITO: Composable para estatísticas do dashboard
 * IMPORTA: Vue 3 Composition API
 * USADO_POR: Página inicial e componentes relacionados a estatísticas
 */

import type { DashboardStats } from '../../types/dashboard.types'

export const useDashboardStats = () => {
  const stats = ref<DashboardStats>({
    totalAgendamentos: 0,
    agendamentosHoje: 0,
    totalClientes: 0,
    clientesAtivos: 0,
    loading: true,
    error: null
  })

  const fetchStats = async () => {
    try {
      stats.value.loading = true
      stats.value.error = null
      
      // Simular dados - em uma aplicação real, seria uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular loading
      
      stats.value = {
        totalAgendamentos: 247,
        agendamentosHoje: 8,
        totalClientes: 156,
        clientesAtivos: 142,
        loading: false,
        error: null
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      stats.value.loading = false
      stats.value.error = 'Erro ao carregar estatísticas'
    }
  }

  const refreshStats = () => {
    fetchStats()
  }

  return {
    stats: readonly(stats),
    fetchStats,
    refreshStats
  }
}
/**
 * PROPÓSITO: Exportações do módulo de agendamentos
 * IMPORTA: Componentes e composables do módulo
 * USADO_POR: Páginas e outros módulos que precisam de agendamentos
 */

// Exportar composable
export { useAgendamentos } from './composables/agendamentos'

// Exportar store
export { useAgendamentoStore } from './stores/useAgendamentoStore'

// Exportar componentes
export { default as AgendamentoManager } from './components/AgendamentoManager.vue'
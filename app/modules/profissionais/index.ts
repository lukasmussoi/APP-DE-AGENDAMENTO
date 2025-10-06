/**
 * PROPÓSITO: Exportações do módulo profissionais
 * IMPORTA: Composables e tipos do módulo
 * USADO_POR: Outros módulos que precisam importar funcionalidades de profissionais
 */

// Composables
export { useProfissionais } from './composables/profissionais'

// Components
export { default as EspecialidadesTable } from './components/EspecialidadesTable.vue'

// Types
export type { Especialidade } from './types/especialidade.types'
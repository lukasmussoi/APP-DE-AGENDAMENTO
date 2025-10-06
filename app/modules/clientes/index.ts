/**
 * PROPÓSITO: Export barrel para o módulo clientes
 * IMPORTA: Componentes, composables e tipos do módulo
 * USADO_POR: Outros módulos ou páginas que importam funcionalidades de clientes
 */

export { useClientes } from './composables/clientes'
export { default as TabelaClientes } from './components/TabelaClientes.vue'
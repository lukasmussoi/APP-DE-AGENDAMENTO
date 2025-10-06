/**
 * PROPÓSITO: Tipos TypeScript para o dashboard
 * IMPORTA: N/A
 * USADO_POR: Composables e componentes relacionados ao dashboard
 */

export interface DashboardStats {
  totalAgendamentos: number
  agendamentosHoje: number
  totalClientes: number
  clientesAtivos: number
  loading: boolean
  error: string | null
}

export interface AgendamentoRecente {
  id: string
  clienteNome: string
  servico: string
  dataHora: string
  status: 'confirmado' | 'pendente' | 'cancelado'
}

export interface ClienteRecente {
  id: string
  nome: string
  email: string
  telefone: string
  ultimoAgendamento: string
}
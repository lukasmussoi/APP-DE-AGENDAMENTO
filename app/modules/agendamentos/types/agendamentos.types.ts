/**
 * PROPÓSITO: Tipos TypeScript para o módulo de agendamentos
 * IMPORTA: Nenhum
 * USADO_POR: Componentes e composables do módulo de agendamentos
 */

export interface Agendamento {
  id: number
  created_at: string // Timestamp ISO
  user_id: number | null
  profissional_id: number | null
  cliente_id: number | null
  data: string | null // Formato YYYY-MM-DD
  hora_inicio: string | null // Formato HH:MM:SS+TZ
  hora_fim: string | null // Formato HH:MM:SS+TZ
  titulo: string | null
  descricao: string | null
  cancelado: boolean | null
  cancelado_as: string | null // Timestamp ISO
  cor: string | null
}
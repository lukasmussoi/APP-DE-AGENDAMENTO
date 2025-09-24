/**
 * PROPÓSITO: Tipos para tabela ag_profiles
 * IMPORTA: Nenhum
 * USADO_POR: Stores e composables de perfil
 */

export interface Profile {
  id: number
  created_at: string
  user_id: string | null
  nome: string | null
  role: string | null
}
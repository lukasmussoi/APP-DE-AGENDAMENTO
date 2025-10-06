/**
 * PROPÓSITO: Tipos para entidade Cliente
 * IMPORTA: Nenhum
 * USADO_POR: Composables e componentes do módulo clientes
 */

export type Cliente = {
  id: number
  created_at: string
  cpf: string
  nome: string | null
  endereco: string | null
  email: string
  telefone: string | null
}
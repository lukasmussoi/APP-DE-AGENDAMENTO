/**
 * PROPÓSITO: Tipos TypeScript para especialidades do módulo profissionais
 * IMPORTA: Nenhum
 * USADO_POR: Composables e componentes do módulo profissionais
 */

export interface Especialidade {
  id: number
  especialidade: string
}

export interface RpcResponse {
  success: boolean
  message: string
}
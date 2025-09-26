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

export interface Profissional {
  id: number
  nome: string
  especialidade: string
  profile_id: string
  especialidade_id: number
}

export interface RpcResponseProfissionais {
  data: Profissional[]
  message: string
  success: boolean
}
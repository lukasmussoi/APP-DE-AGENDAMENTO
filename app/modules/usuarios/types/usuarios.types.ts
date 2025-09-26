/**
 * PROPÓSITO: Tipos TypeScript para o módulo de usuários
 * IMPORTA: Nenhum
 * USADO_POR: Composables e componentes do módulo usuários
 */

export interface UsuarioAuth {
  instance_id: string
  id: string
  aud: string
  role: string
  email: string
  encrypted_password: string
  email_confirmed_at: string
  invited_at: string | null
  confirmation_token: string
  confirmation_sent_at: string | null
  recovery_token: string
  recovery_sent_at: string | null
  email_change_token_new: string
  email_change: string
  email_change_sent_at: string | null
  last_sign_in_at: string | null
  raw_app_meta_data: any
  raw_user_meta_data: any
  is_super_admin: boolean | null
  created_at: string
  updated_at: string
  phone: string | null
  phone_confirmed_at: string | null
  phone_change: string
  phone_change_token: string
  phone_change_sent_at: string | null
  confirmed_at: string
  email_change_token_current: string
  email_change_confirm_status: number
  banned_until: string | null
  reauthentication_token: string
  reauthentication_sent_at: string | null
  is_sso_user: boolean
  deleted_at: string | null
  is_anonymous: boolean
}

export interface Perfil {
  id: number
  created_at: string
  user_id: string
  nome: string
  role: 'admin' | 'user'
}

export interface ProfissionalCadastrado {
  id: number
  created_at: string
  profile_id: number
  especialidade_id: number
  nome_profissional: string
  especialidade: string
}

export interface EspecialidadeDisponivel {
  id: number
  created_at: string
  especialidade: string
}

export interface DadosAdminCompletos {
  usuarios: UsuarioAuth[]
  perfis: Perfil[]
  profissionais: ProfissionalCadastrado[]
  especialidades: EspecialidadeDisponivel[]
}

export interface RpcResponseDadosAdmin {
  data: DadosAdminCompletos
  message: string
  success: boolean
}

// Manter compatibilidade com a resposta anterior
export interface RpcResponsePerfis {
  data: Perfil[]
  message: string
  success: boolean
}
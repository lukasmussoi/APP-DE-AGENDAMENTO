/**
 * PROPÓSITO: Gerenciar dados de usuários, perfis, profissionais e especialidades
 * IMPORTA: Supabase client, tipos de dados
 * USADO_POR: páginas de profissionais, clientes, agendamentos
 */

import type { UsuarioAuth, Perfil, ProfissionalCadastrado, EspecialidadeDisponivel, RpcResponseDadosAdmin } from '../types/usuarios.types'
import { useProfileStore } from '../../../shared/stores/useProfileStore'

export const useUsuarios = () => {
  const supabase = useSupabaseClient()
  const profileStore = useProfileStore()

  // Estados reativos
  const perfis = ref<Perfil[]>([])
  const profissionaisCadastrados = ref<ProfissionalCadastrado[]>([])
  const especialidadesDisponiveis = ref<EspecialidadeDisponivel[]>([])
  const usuarios = ref<UsuarioAuth[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed para dados processados
  const perfisAtivos = computed(() => perfis.value)
  const profissionaisAtivos = computed(() => profissionaisCadastrados.value)
  const especialidadesAtivas = computed(() => especialidadesDisponiveis.value)

  /**
   * Busca todos os dados administrativos (usuários, perfis, profissionais, especialidades)
   */
  const fetchDadosAdmin = async (): Promise<void> => {
    // Verificar se o usuário é admin
    if (profileStore.currentProfile?.role !== 'admin') {
      throw new Error('Acesso negado')
    }

    loading.value = true
    error.value = null

    try {
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('ag_listar_todos_profiles_admin')

      if (rpcError) {
        throw new Error(`Erro na RPC: ${rpcError.message}`)
      }

      if (!rpcData) {
        throw new Error('Nenhum dado retornado pela RPC')
      }

      // Processar dados da nova estrutura
      const dados: RpcResponseDadosAdmin = rpcData

      // Atualizar estados reativos
      usuarios.value = dados.data.usuarios || []
      perfis.value = dados.data.perfis || []
      profissionaisCadastrados.value = dados.data.profissionais || []
      especialidadesDisponiveis.value = dados.data.especialidades || []

      console.log('Dados carregados:', {
        usuarios: usuarios.value.length,
        perfis: perfis.value.length,
        profissionais: profissionaisCadastrados.value.length,
        especialidades: especialidadesDisponiveis.value.length
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = errorMessage
      console.error('Erro ao buscar dados admin:', errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca apenas perfis (compatibilidade com código existente)
   * @deprecated Use fetchDadosAdmin() para buscar todos os dados
   */
  const fetchPerfis = async (): Promise<void> => {
    await fetchDadosAdmin()
  }

  /**
   * Busca apenas profissionais (compatibilidade com código existente)
   * @deprecated Use fetchDadosAdmin() para buscar todos os dados
   */
  const fetchProfissionais = async (): Promise<void> => {
    await fetchDadosAdmin()
  }

  /**
   * Busca apenas especialidades (compatibilidade com código existente)
   * @deprecated Use fetchDadosAdmin() para buscar todos os dados
   */
  const fetchEspecialidades = async (): Promise<void> => {
    await fetchDadosAdmin()
  }

  /**
   * Busca perfis básicos (para dropdown de usuários) - mantido para compatibilidade
   * @deprecated Use fetchDadosAdmin() para buscar todos os dados
   */
  const fetchPerfisBasic = async (): Promise<void> => {
    await fetchDadosAdmin()
  }

  /**
   * Atualiza apenas o nome do usuário no perfil
   */
  const updateUserName = async (nome: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const user = useSupabaseUser()
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }

      const { data: rpcData, error: profileError } = await supabase
        .rpc('ag_editar_nome_usuario', {
          p_nome: nome
        } as any)

      if (profileError) {
        throw new Error(`Erro ao atualizar nome: ${profileError.message}`)
      }

      // Verificar resposta da RPC
      const response = (rpcData as any)?.[0]?.ag_editar_nome_usuario
      if (!response?.success) {
        throw new Error('Falha ao atualizar nome do usuário')
      }

      console.log('Nome atualizado com sucesso:', response.message)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = errorMessage
      console.error('Erro ao atualizar nome:', errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Atualiza apenas o email do usuário na autenticação
   */
  const updateUserEmail = async (email: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const user = useSupabaseUser()
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }

      const { error: authError } = await supabase.auth.updateUser({
        email: email
      })

      if (authError) {
        throw new Error(`Erro ao atualizar email: ${authError.message}`)
      }

      console.log('Email atualizado com sucesso')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = errorMessage
      console.error('Erro ao atualizar email:', errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Atualiza apenas a senha do usuário na autenticação
   */
  const updateUserPassword = async (senha: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const user = useSupabaseUser()
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }

      const { error: authError } = await supabase.auth.updateUser({
        password: senha
      })

      if (authError) {
        throw new Error(`Erro ao atualizar senha: ${authError.message}`)
      }

      console.log('Senha atualizada com sucesso')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = errorMessage
      console.error('Erro ao atualizar senha:', errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Atualiza o perfil do usuário (nome, email, senha) - função mantida para compatibilidade
   * @deprecated Use as funções específicas: updateUserName, updateUserEmail, updateUserPassword
   */
  const updateUserProfile = async (updates: {
    nome?: string
    email?: string
    senha?: string
  }): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const user = useSupabaseUser()
      if (!user.value) {
        throw new Error('Usuário não autenticado')
      }

      // Preparar updates para Supabase Auth
      const authUpdates: any = {}

      if (updates.email) {
        authUpdates.email = updates.email
      }

      if (updates.senha) {
        authUpdates.password = updates.senha
      }

      // Atualizar dados de autenticação se houver mudanças
      if (Object.keys(authUpdates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(authUpdates)
        if (authError) {
          throw new Error(`Erro ao atualizar autenticação: ${authError.message}`)
        }
      }

      // Atualizar dados do perfil na tabela profiles se houver nome
      if (updates.nome) {
        const { data: rpcData, error: profileError } = await supabase
          .rpc('ag_editar_nome_usuario', {
            p_nome: updates.nome
          } as any)

        if (profileError) {
          throw new Error(`Erro ao atualizar nome: ${profileError.message}`)
        }

        // Verificar resposta da RPC
        const response = (rpcData as any)?.[0]?.ag_editar_nome_usuario
        if (!response?.success) {
          throw new Error('Falha ao atualizar nome do usuário')
        }

        console.log('Nome atualizado via RPC:', response.message)
      }

      console.log('Perfil atualizado com sucesso:', updates)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = errorMessage
      console.error('Erro ao atualizar perfil:', errorMessage)
      throw err // Re-throw para que o componente possa tratar
    } finally {
      loading.value = false
    }
  }

  return {
    // Estados
    perfis: readonly(perfis),
    profissionaisCadastrados: readonly(profissionaisCadastrados),
    especialidadesDisponiveis: readonly(especialidadesDisponiveis),
    usuarios: readonly(usuarios),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    perfisAtivos,
    profissionaisAtivos,
    especialidadesAtivas,

    // Ações
    fetchDadosAdmin,
    fetchPerfis,
    fetchProfissionais,
    fetchEspecialidades,
    fetchPerfisBasic,
    updateUserName,
    updateUserEmail,
    updateUserPassword,
    updateUserProfile
  }
}
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
    fetchPerfisBasic
  }
}
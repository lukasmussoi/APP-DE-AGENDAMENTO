/**
 * PROPÓSITO: Composable para obter nome e especialidade do usuário logado
 * IMPORTA: useAuth, useProfileStore, useSupabaseClient, tipos de Especialidade e Profissional
 * USADO_POR: Componentes de agendamentos que precisam exibir dados do usuário profissional
 */

import { ref, computed } from 'vue'
import { useSupabaseClient } from '#imports'
import { useAuth } from '../../../shared/composables/useAuth'
import { useProfileStore } from '../../../shared/stores/useProfileStore'
import type { Especialidade, Profissional, RpcResponseProfissionais } from '../../profissionais/types/especialidade.types'

export const profissionalAtual = () => {
  const supabase = useSupabaseClient()
  const { user } = useAuth()
  const profileStore = useProfileStore()

  // Estado reativo
  const userEspecialidade = ref<{ id: number | null; nome: string; especialidade: string } | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed para verificar se dados estão carregados
  const isLoaded = computed(() => !!userEspecialidade.value)

  // Função para buscar especialidades (similar ao useProfissionais)
  const fetchEspecialidades = async (): Promise<Especialidade[]> => {
    const { data, error: fetchError } = await supabase
      .from('ag_especialidades')
      .select('*')
      .order('especialidade', { ascending: true })

    if (fetchError) throw fetchError
    return data || []
  }

  // Função para buscar profissional por profile_id
  const fetchProfissionalByProfileId = async (profileId: number): Promise<Profissional | null> => {
    const { data, error: fetchError } = await supabase
      .from('ag_profissionais')
      .select('*')
      .eq('profile_id', profileId.toString())
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return null // Nenhum encontrado
      throw fetchError
    }
    return data as Profissional
  }

  // Função para buscar lista de profissionais
  const fetchProfissionais = async (): Promise<Profissional[]> => {
    const { data, error: fetchError } = await supabase.rpc('ag_listar_profissionais_admin') as { data: any, error: any }

    if (fetchError) throw fetchError

    // Processar o retorno da RPC - tentar diferentes estruturas possíveis
    let response: RpcResponseProfissionais | null = null

    if (Array.isArray(data) && data.length > 0) {
      // Se é array, pode ser data[0]['ag_listar_profissionais_admin'] ou data[0] diretamente
      if (data[0]['ag_listar_profissionais_admin']) {
        response = data[0]['ag_listar_profissionais_admin'] as RpcResponseProfissionais
      } else {
        response = data[0] as RpcResponseProfissionais
      }
    } else if (data && typeof data === 'object') {
      // Se é objeto, pode ser data['ag_listar_profissionais_admin'] ou data diretamente
      if (data['ag_listar_profissionais_admin']) {
        response = data['ag_listar_profissionais_admin'] as RpcResponseProfissionais
      } else {
        response = data as RpcResponseProfissionais
      }
    }

    if (response && response.success) {
      return response.data || []
    } else if (response) {
      throw new Error(response.message || 'Erro ao buscar profissionais')
    } else {
      // Se não conseguiu parsear, assumir array vazio
      console.warn('Não foi possível parsear a resposta da RPC:', data)
      return []
    }
  }

  // Função principal para buscar dados do usuário
  const fetchUserEspecialidade = async () => {
    if (!user.value) {
      error.value = 'Usuário não autenticado'
      return
    }

    try {
      loading.value = true
      error.value = null

      // Buscar perfil do usuário
      const profile = await profileStore.fetchProfileByUserId(user.value.id)
      if (!profile || !profile.nome) {
        error.value = 'Perfil não encontrado ou nome não definido'
        return
      }

      // Buscar profissional associado ao perfil
      const profissional = await fetchProfissionalByProfileId(profile.id)
      if (!profissional) {
        // Se não encontrou profissional para o usuário, buscar lista e pegar o primeiro disponível
        const profissionais = await fetchProfissionais()
        if (profissionais.length === 0) {
          error.value = 'Nenhum profissional encontrado no sistema'
          return
        }
        const primeiroProfissional = profissionais[0]
        if (!primeiroProfissional) {
          error.value = 'Erro ao obter primeiro profissional'
          return
        }

        // Buscar especialidade correspondente
        const especialidades = await fetchEspecialidades()
        const especialidade = especialidades.find(e => e.id === primeiroProfissional.especialidade_id)

        if (!especialidade) {
          error.value = 'Especialidade não encontrada para o primeiro profissional'
          return
        }

        // Usar dados do primeiro profissional disponível
        userEspecialidade.value = {
          id: primeiroProfissional.id,
          nome: primeiroProfissional.nome,
          especialidade: especialidade.especialidade
        }
        return
      }

      // Se encontrou profissional para o usuário, prosseguir normalmente
      // Buscar especialidade correspondente
      const especialidades = await fetchEspecialidades()
      const especialidade = especialidades.find(e => e.id === profissional.especialidade_id)

      if (!especialidade) {
        error.value = 'Especialidade não encontrada'
        return
      }

      // Definir resultado
      userEspecialidade.value = {
        id: profissional.id,
        nome: profile.nome,
        especialidade: especialidade.especialidade
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar dados do usuário:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    userEspecialidade,
    loading,
    error,
    isLoaded,

    // Actions
    fetchUserEspecialidade
  }
}
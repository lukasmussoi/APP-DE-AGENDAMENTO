/**
 * PROPÓSITO: Composable para buscar informações do profissional logado
 * IMPORTA: useAuth, useProfileStore, useProfissionais
 * USADO_POR: Componentes que precisam exibir dados do profissional logado
 */

import { useAuth } from '../../../shared/composables/useAuth'
import { useProfileStore } from '../../../shared/stores/useProfileStore'
import { useProfissionais } from '../../profissionais/composables/profissionais'

export const useProfissionalLogado = () => {
  const { user } = useAuth()
  const profileStore = useProfileStore()
  const { fetchProfissionais, profissionais } = useProfissionais()

  // Estado reativo
  const profissionalInfo = ref<{
    nome: string
    especialidade: string
  } | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed para verificar se tem dados carregados
  const hasData = computed(() => !!profissionalInfo.value)

  // Função para buscar profissional do usuário logado diretamente do banco
  const buscarProfissionalDoUsuarioLogado = async (userId: string) => {
    try {
      console.log('🔍 Buscando profissional para userId:', userId)

      // Buscar todos os profissionais
      if (profissionais.value.length === 0) {
        await fetchProfissionais()
      }

      console.log('📋 Profissionais carregados:', profissionais.value.length)

      // Buscar todos os perfis
      await profileStore.fetchProfiles()
      const allProfiles = profileStore.profiles

      console.log('👥 Perfis carregados:', allProfiles.length)

      // Encontrar combinação: profissional + perfil que corresponde ao userId
      for (const profissional of profissionais.value) {
        console.log('� Verificando profissional:', profissional.id, 'profile_id:', profissional.profile_id)

        // Encontrar o perfil que corresponde ao profile_id do profissional
        const perfilCorrespondente = allProfiles.find(profile => {
          // Tentar diferentes comparações
          return profile.id.toString() === profissional.profile_id ||
                 profile.id === parseInt(profissional.profile_id) ||
                 profile.user_id === profissional.profile_id
        })

        if (perfilCorrespondente) {
          console.log('🎯 Perfil encontrado para profissional:', perfilCorrespondente)

          if (perfilCorrespondente.user_id === userId) {
            console.log('✅ MATCH! Profissional encontrado para usuário logado:', profissional)
            return profissional
          }
        }
      }

      console.log('⚠️ Nenhum profissional encontrado para este usuário')
      return null
    } catch (err: any) {
      console.error('Erro ao buscar profissional do usuário logado:', err)
      return null
    }
  }

  // Função principal para buscar informações do profissional logado
  const buscarProfissionalLogado = async () => {
    console.log('🚀 INÍCIO: buscarProfissionalLogado chamado')
    try {
      loading.value = true
      error.value = null
      profissionalInfo.value = null

      // Verificar se usuário está logado
      if (!user.value?.id) {
        error.value = 'Usuário não está logado'
        return null
      }

      console.log('👤 Usuário logado:', user.value.id)

      // Buscar perfil do usuário
      const profile = await profileStore.fetchProfileByUserId(user.value.id)

      if (!profile) {
        console.log('❌ Perfil não encontrado para user_id:', user.value.id)
        error.value = 'Perfil não encontrado'
        return null
      }

      console.log('✅ Perfil encontrado:', profile)
      console.log('🔢 Profile ID (number):', profile.id, 'Tipo:', typeof profile.id)

      // Buscar profissional relacionado ao perfil
      const profissional = await buscarProfissionalDoUsuarioLogado(user.value.id)

      if (profissional) {
        // Usuário tem especialidade definida
        profissionalInfo.value = {
          nome: profissional.nome,
          especialidade: profissional.especialidade
        }
        console.log('🎉 Profissional com especialidade encontrado:', profissionalInfo.value)
      } else {
        // Usuário não tem especialidade, pegar o primeiro profissional disponível
        console.log('⚠️ Usuário não tem especialidade, buscando primeiro profissional disponível')

        if (profissionais.value.length === 0) {
          await fetchProfissionais()
        }

        if (profissionais.value.length > 0) {
          const primeiroProfissional = profissionais.value[0]
          if (primeiroProfissional) {
            profissionalInfo.value = {
              nome: primeiroProfissional.nome,
              especialidade: primeiroProfissional.especialidade
            }
            console.log('🏥 Usando primeiro profissional disponível:', profissionalInfo.value)
          } else {
            error.value = 'Dados do primeiro profissional são inválidos'
            return null
          }
        } else {
          error.value = 'Nenhum profissional encontrado no sistema'
          return null
        }
      }

      return profissionalInfo.value
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar profissional logado:', err)
      return null
    } finally {
      loading.value = false
      console.log('🏁 FIM: buscarProfissionalLogado finalizado')
    }
  }

  // Função para resetar os dados
  const reset = () => {
    profissionalInfo.value = null
    error.value = null
  }

  return {
    // Estado
    profissionalInfo,
    loading,
    error,
    hasData,

    // Ações
    buscarProfissionalLogado,
    reset
  }
}
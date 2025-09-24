/**
 * PROPÓSITO: Store Pinia para gerenciar perfis de usuários (tabela ag_profiles)
 * IMPORTA: Pinia, Supabase, tipos de Profile
 * USADO_POR: Componentes que precisam acessar dados de perfil
 */

import { defineStore } from 'pinia'
import type { Profile } from '../../../shared/types/profile.types'

export const useProfileStore = defineStore('profile', () => {
  const supabase = useSupabaseClient()
  
  // Estado reativo
  const currentProfile = ref<Profile | null>(null)
  const profiles = ref<Profile[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Action para buscar perfil por user_id e salvar como currentProfile
  const fetchProfileByUserId = async (userId: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('ag_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // Nenhum perfil encontrado
          currentProfile.value = null
          error.value = 'Perfil não encontrado'
        } else {
          throw fetchError
        }
      } else {
        currentProfile.value = data as Profile
      }

      return currentProfile.value
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar perfil por user_id:', err)
      currentProfile.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  // Action para buscar todos os perfis
  const fetchProfiles = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('ag_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      profiles.value = data || []
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar perfis:', err)
    } finally {
      loading.value = false
    }
  }

  // Action para buscar perfil por ID
  const fetchProfileById = async (id: number) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('ag_profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      return data as Profile
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar perfil:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Action para resetar o store
  const $reset = () => {
    currentProfile.value = null
    profiles.value = []
    error.value = null
  }

  return {
    // Estado
    currentProfile,
    profiles,
    loading,
    error,
    
    // Actions
    fetchProfiles,
    fetchProfileById,
    fetchProfileByUserId,
    $reset
  }
})
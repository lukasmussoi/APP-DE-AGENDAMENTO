/**
 * PROPÓSITO: Composable para gerenciar operações relacionadas a profissionais
 * IMPORTA: Supabase, tipos de Especialidade
 * USADO_POR: Componentes e páginas relacionadas a profissionais
 */

import type { Especialidade } from '../types/especialidade.types'

export const useProfissionais = () => {
  const supabase = useSupabaseClient()

  // Estado reativo
  const especialidades = ref<Especialidade[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Função para buscar todas as especialidades
  const fetchEspecialidades = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('ag_especialidades')
        .select('*')
        .order('especialidade', { ascending: true })

      if (fetchError) throw fetchError

      especialidades.value = data || []
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar especialidades:', err)
    } finally {
      loading.value = false
    }
  }

  // Função para buscar especialidade por ID
  const fetchEspecialidadeById = async (id: number) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('ag_especialidades')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      return data as Especialidade
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar especialidade:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    especialidades,
    loading,
    error,

    // Actions
    fetchEspecialidades,
    fetchEspecialidadeById
  }
}
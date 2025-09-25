/**
 * PROPÓSITO: Composable para gerenciar operações relacionadas a profissionais
 * IMPORTA: Supabase, tipos de Especialidade
 * USADO_POR: Componentes e páginas relacionadas a profissionais
 */

import type { Especialidade, RpcResponse } from '../types/especialidade.types'

export const useProfissionais = () => {
  const supabase = useSupabaseClient()

  // Estado reativo
  const especialidades = ref<Especialidade[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const inserting = ref(false)

  // Função para buscar todas as especialidades
  const fetchEspecialidades = async () => {
    // Guard: Evitar execuções simultâneas
    if (loading.value) return

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

  // Função para inserir nova especialidade
  const insertEspecialidade = async (especialidade: string): Promise<RpcResponse> => {
    // Guard: Evitar execuções simultâneas
    if (inserting.value) return { success: false, message: 'Operação já em andamento' }

    try {
      inserting.value = true
      error.value = null

      const { data, error: insertError } = await supabase
        .rpc('inserir_especialidade_admin', {
          p_especialidade: especialidade
        })

      if (insertError) throw insertError

      const result = data as RpcResponse

      // Verificar se a operação foi bem-sucedida baseado no retorno JSONB
      if (!result.success) {
        throw new Error(result.message || 'Erro ao inserir especialidade')
      }

      // Recarregar especialidades após inserção
      await fetchEspecialidades()

      return result
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao inserir especialidade:', err)
      throw err
    } finally {
      inserting.value = false
    }
  }

  return {
    // Estado
    especialidades,
    loading,
    error,
    inserting,

    // Actions
    fetchEspecialidades,
    fetchEspecialidadeById,
    insertEspecialidade
  }
}
/**
 * PROPÓSITO: Composable para gerenciar operações relacionadas a profissionais
 * IMPORTA: Supabase, tipos de Especialidade
 * USADO_POR: Componentes e páginas relacionadas a profissionais
 */

import type { Especialidade, RpcResponse, Profissional, RpcResponseProfissionais } from '../types/especialidade.types'

export const useProfissionais = () => {
  const supabase = useSupabaseClient()

  // Estado reativo
  const especialidades = ref<Especialidade[]>([])
  const profissionais = ref<Profissional[]>([])
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

  // Função para atualizar especialidade
  const updateEspecialidade = async (id: number, especialidade: string): Promise<RpcResponse> => {
    // Guard: Evitar execuções simultâneas
    if (inserting.value) return { success: false, message: 'Operação já em andamento' }

    try {
      inserting.value = true
      error.value = null

      const { data, error: updateError } = await supabase
        .rpc('ag_editar_especialidade_admin', {
          p_id: id,
          p_especialidade: especialidade
        })

      if (updateError) throw updateError

      const result = data as RpcResponse

      // Verificar se a operação foi bem-sucedida baseado no retorno JSONB
      if (!result.success) {
        throw new Error(result.message || 'Erro ao editar especialidade')
      }

      // Recarregar especialidades após atualização
      await fetchEspecialidades()

      return result
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao editar especialidade:', err)
      throw err
    } finally {
      inserting.value = false
    }
  }

  // Função para deletar especialidade
  const deleteEspecialidade = async (id: number): Promise<boolean> => {
    // Guard: Evitar execuções simultâneas
    if (inserting.value) return false

    try {
      inserting.value = true
      error.value = null

      const { error: deleteError } = await supabase
        .from('ag_especialidades')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Recarregar especialidades após exclusão
      await fetchEspecialidades()

      return true
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao deletar especialidade:', err)
      throw err
    } finally {
      inserting.value = false
    }
  }

  // Função para buscar profissionais
  const fetchProfissionais = async () => {
    // Guard: Evitar execuções simultâneas
    if (loading.value) return

    try {
      loading.value = true
      error.value = null

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
        profissionais.value = response.data || []
        console.log('Profissionais carregados:', profissionais.value)
      } else if (response) {
        throw new Error(response.message || 'Erro ao buscar profissionais')
      } else {
        // Se não conseguiu parsear, assumir array vazio
        profissionais.value = []
        console.warn('Não foi possível parsear a resposta da RPC:', data)
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar profissionais:', err)
    } finally {
      loading.value = false
    }
  }

  // Função para inserir novo profissional
  const insertProfissional = async (profileId: number, especialidadeId: number): Promise<RpcResponse> => {
    // Guard: Evitar execuções simultâneas
    if (inserting.value) return { success: false, message: 'Operação já em andamento' }

    try {
      inserting.value = true
      error.value = null

      const { error: insertError } = await (supabase as any)
        .from('ag_profissionais')
        .insert({
          profile_id: profileId,
          especialidade_id: especialidadeId
        })

      if (insertError) throw insertError

      // Recarregar profissionais após inserção
      await fetchProfissionais()

      return { success: true, message: 'Profissional inserido com sucesso' }
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao inserir profissional:', err)
      throw err
    } finally {
      inserting.value = false
    }
  }

  // Função para atualizar profissional
  const updateProfissional = async (id: number, profileId: number, especialidadeId: number): Promise<RpcResponse> => {
    // Guard: Evitar execuções simultâneas
    if (inserting.value) return { success: false, message: 'Operação já em andamento' }

    try {
      inserting.value = true
      error.value = null

      const { error: updateError } = await (supabase as any)
        .from('ag_profissionais')
        .update({
          profile_id: profileId,
          especialidade_id: especialidadeId
        })
        .eq('id', id)

      if (updateError) throw updateError

      // Recarregar profissionais após atualização
      await fetchProfissionais()

      return { success: true, message: 'Profissional atualizado com sucesso' }
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao editar profissional:', err)
      throw err
    } finally {
      inserting.value = false
    }
  }

  // Função para deletar profissional
  const deleteProfissional = async (id: number): Promise<boolean> => {
    // Guard: Evitar execuções simultâneas
    if (inserting.value) return false

    try {
      inserting.value = true
      error.value = null

      const { error: deleteError } = await supabase
        .from('ag_profissionais')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Recarregar profissionais após exclusão
      await fetchProfissionais()

      return true
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao deletar profissional:', err)
      throw err
    } finally {
      inserting.value = false
    }
  }

  // Função para preparar novo profissional (chamada ao abrir modal)
  const prepareNewProfissional = async () => {
    try {
      // Aqui podemos adicionar lógica de preparação se necessário
      // Por exemplo, verificar permissões, carregar dados adicionais, etc.
      console.log('Preparando novo profissional...')

      // Por enquanto, apenas log. Pode ser expandido conforme necessidade
      return { success: true, message: 'Pronto para criar novo profissional' }
    } catch (err: any) {
      console.error('Erro ao preparar novo profissional:', err)
      throw err
    }
  }

  return {
    // Estado
    especialidades,
    profissionais,
    loading,
    error,
    inserting,

    // Actions
    fetchEspecialidades,
    fetchEspecialidadeById,
    insertEspecialidade,
    updateEspecialidade,
    deleteEspecialidade,
    fetchProfissionais,
    insertProfissional,
    updateProfissional,
    deleteProfissional,
    prepareNewProfissional
  }
}
/**
 * PROPÓSITO: Composable para gerenciar deleção de usuários
 * IMPORTA: Composables de toast
 * USADO_POR: TabelaUsuarios.vue
 */

import { toast } from 'vue3-toastify'

export const useDeletarUsuario = () => {
  const loading = ref(false)

  const deletarUsuario = async (userId: string): Promise<boolean> => {
    if (loading.value) return false

    loading.value = true

    try {
      console.log(`🗑️ Deletando usuário: ${userId}`)

      const response = await $fetch<{
        success: boolean
        message: string
        user_id: string
      }>(`/api/usuarios/deletar?user_id=${userId}`, {
        method: 'DELETE'
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      console.log('✅ Usuário deletado com sucesso:', response)
      
      toast.success('Usuário deletado com sucesso!', {
        autoClose: 3000,
        position: 'top-right'
      })

      return true

    } catch (error: any) {
      console.error('❌ Erro ao deletar usuário:', error)
      
      // Tratamento de diferentes tipos de erro
      let errorMessage = 'Erro ao deletar usuário'
      
      if (error.statusCode === 400) {
        errorMessage = 'Dados inválidos para deleção'
      } else if (error.statusCode === 404) {
        errorMessage = 'Usuário não encontrado'
      } else if (error.statusCode === 500) {
        errorMessage = 'Erro interno do servidor'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage, {
        autoClose: 5000,
        position: 'top-right'
      })

      return false

    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    deletarUsuario
  }
}
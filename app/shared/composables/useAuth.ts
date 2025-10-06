/**
 * PROPÓSITO: Composable para gerenciamento de autenticação com Supabase
 * IMPORTA: useSupabaseClient, useSupabaseUser, navigateTo
 * USADO_POR: Componentes de autenticação
 */
import { ref, computed } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Estado de loading
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed para verificar se está autenticado
  const isAuthenticated = computed(() => !!user.value)

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        error.value = loginError.message
        return { success: false, error: loginError.message }
      }

      // Redirecionar para a página inicial após login bem-sucedido
      await navigateTo('/')

      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Função de logout
  const logout = async () => {
    try {
      isLoading.value = true
      error.value = null

      const { error: logoutError } = await supabase.auth.signOut()

      if (logoutError) {
        error.value = logoutError.message
        return { success: false, error: logoutError.message }
      }

      // Redirecionar para login após logout
      await navigateTo('/login')

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Função de reset de senha
  const resetPassword = async (email: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/recuperar-senha`,
      })

      if (resetError) {
        error.value = resetError.message
        return { success: false, error: resetError.message }
      }

      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Função para atualizar senha (após verificação do token)
  const updatePassword = async (newPassword: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        error.value = updateError.message
        return { success: false, error: updateError.message }
      }

      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Função para atualizar email do usuário
  const updateEmail = async (newEmail: string) => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: updateError } = await supabase.auth.updateUser({
        email: newEmail
      })

      if (updateError) {
        error.value = updateError.message
        return { success: false, error: updateError.message }
      }

      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Função para verificar se o usuário logado é admin
  const isAdmin = async () => {
    try {
      // Verificar se existe usuário logado
      if (!user.value) {
        return { success: false, isAdmin: false, error: 'Usuário não autenticado' }
      }

      const { data, error: rpcError } = await supabase.rpc('ag_is_admin') as { 
        data: any, 
        error: any 
      }

      if (rpcError) {
        console.error('Erro ao verificar se usuário é admin:', rpcError)
        return { success: false, isAdmin: false, error: rpcError.message }
      }

      // Processar resposta da RPC - extrair o valor booleano
      let isAdminValue = false
      
      // A RPC está retornando diretamente { "isadmin": boolean }
      if (data && typeof data.isadmin === 'boolean') {
        isAdminValue = data.isadmin
      } else if (Array.isArray(data) && data.length > 0) {
        // Fallback para estrutura de array (caso mude no futuro)
        const response = data[0]
        
        if (response && response.ag_is_admin && typeof response.ag_is_admin.isadmin === 'boolean') {
          isAdminValue = response.ag_is_admin.isadmin
        } else if (response && typeof response.isadmin === 'boolean') {
          isAdminValue = response.isadmin
        }
      }

      return { success: true, isAdmin: isAdminValue }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      console.error('Erro ao verificar admin:', err)
      return { success: false, isAdmin: false, error: message }
    }
  }

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    error,

    // Ações
    login,
    logout,
    resetPassword,
    updatePassword,
    updateEmail,
    isAdmin,
  }
}
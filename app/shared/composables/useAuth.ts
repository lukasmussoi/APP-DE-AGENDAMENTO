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

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    error,

    // Ações
    login,
    logout,
  }
}
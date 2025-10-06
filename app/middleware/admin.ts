/**
 * PROPÓSITO: Middleware para proteger rotas administrativas
 * IMPORTA: Supabase client
 * USADO_POR: Páginas que requerem permissão de admin
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    // Obter cliente Supabase e usuário atual
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    // Verificar se usuário está logado
    if (!user.value) {
      return navigateTo('/login')
    }

    // Verificar se o usuário é admin usando a RPC
    const { data, error: rpcError } = await supabase.rpc('ag_is_admin') as { 
      data: any, 
      error: any 
    }

    if (rpcError) {
      console.error('Erro ao verificar admin:', rpcError)
      return navigateTo('/')
    }

    // Processar resposta da RPC
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

    if (!isAdminValue) {
      // Se não for admin, redirecionar para página inicial
      return navigateTo('/')
    }

    // Se chegou até aqui, o usuário é admin - permitir acesso
  } catch (error) {
    // Em caso de erro, redirecionar por segurança
    console.error('Erro no middleware admin:', error)
    return navigateTo('/')
  }
})
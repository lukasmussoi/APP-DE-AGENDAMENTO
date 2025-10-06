/**
 * PROPÓSITO: Endpoint para deletar usuário do sistema (auth + profile)
 * IMPORTA: Supabase service role para operações admin
 * USADO_POR: TabelaUsuarios.vue
 */

import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Verificar método HTTP
  if (event.node.req.method !== 'DELETE') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Método não permitido'
    })
  }

  try {
    // Obter user_id da query ou do body
    const query = getQuery(event)
    const body = await readBody(event).catch(() => ({}))
    const user_id = query.user_id || body.user_id

    // Validar se user_id foi fornecido
    if (!user_id || typeof user_id !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'user_id é obrigatório e deve ser uma string válida'
      })
    }

    // Validar formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(user_id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'user_id deve ser um UUID válido'
      })
    }

    console.log(`🗑️ Iniciando deleção do usuário: ${user_id}`)

    // Obter cliente Supabase com privilégios de service_role
    const supabase = serverSupabaseServiceRole(event)

    // 1. Primeiro, deletar o perfil da tabela ag_profiles
    console.log('📝 Deletando perfil da tabela ag_profiles...')
    const { error: profileError } = await supabase
      .from('ag_profiles')
      .delete()
      .eq('user_id', user_id)

    if (profileError) {
      console.error('❌ Erro ao deletar perfil:', profileError)
      throw createError({
        statusCode: 500,
        statusMessage: `Erro ao deletar perfil: ${profileError.message}`
      })
    }

    console.log('✅ Perfil deletado com sucesso')

    // 2. Depois, deletar o usuário da auth
    console.log('🔐 Deletando usuário da auth...')
    const { error: authError } = await supabase.auth.admin.deleteUser(user_id)

    if (authError) {
      console.error('❌ Erro ao deletar usuário da auth:', authError)
      throw createError({
        statusCode: 500,
        statusMessage: `Erro ao deletar usuário da autenticação: ${authError.message}`
      })
    }

    console.log('✅ Usuário deletado da auth com sucesso')

    console.log(`🎉 Usuário ${user_id} deletado completamente do sistema`)

    // Retornar sucesso
    return {
      success: true,
      message: 'Usuário deletado com sucesso',
      user_id
    }

  } catch (error: any) {
    console.error('❌ Erro geral na deleção do usuário:', error)
    
    // Se já é um erro HTTP, re-lançar
    if (error.statusCode) {
      throw error
    }

    // Caso contrário, criar erro genérico
    throw createError({
      statusCode: 500,
      statusMessage: `Erro interno do servidor: ${error.message || 'Erro desconhecido'}`
    })
  }
})
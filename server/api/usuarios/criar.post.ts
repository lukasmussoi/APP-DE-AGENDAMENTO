/**
 * PROPÓSITO: API server-side para criar usuários no Supabase
 * IMPORTA: serverSupabaseServiceRole para operações admin
 * USADO_POR: Modal de criação de usuários
 */

import { serverSupabaseServiceRole } from '#supabase/server'

// Cache simples para evitar criações duplicadas
const recentRequests = new Map<string, number>()

export default defineEventHandler(async (event) => {
  try {
    // Verificar se é método POST
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Obter dados do body
    const body = await readBody(event)
    const { email, senha, nome, role } = body

    // Prevenir requests duplicados (baseado no email)
    const requestId = `${email}-${nome}-${role}`
    const now = Date.now()
    const lastRequest = recentRequests.get(requestId)
    
    if (lastRequest && (now - lastRequest) < 2000) { // 2 segundos de cooldown
      console.log('⚠️  Request duplicado ignorado:', requestId)
      throw createError({
        statusCode: 429,
        statusMessage: 'Muitas tentativas. Aguarde um momento.'
      })
    }
    
    recentRequests.set(requestId, now)
    
    // Limpar requests antigos (cleanup básico)
    for (const [key, time] of recentRequests.entries()) {
      if (now - time > 10000) { // Remove após 10 segundos
        recentRequests.delete(key)
      }
    }

    // Validações básicas
    if (!email || !senha || !nome || !role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Campos obrigatórios: email, senha, nome, role'
      })
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email inválido'
      })
    }

    // Validar senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Senha deve ter pelo menos 6 caracteres'
      })
    }

    // Validar role
    if (!['user', 'admin'].includes(role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Role deve ser "user" ou "admin"'
      })
    }

    // Obter cliente Supabase com privilégios de admin
    const supabaseAdmin = serverSupabaseServiceRole(event)

    console.log('📝 Criando usuário:', { email, nome, role })

    // Passo 1: Criar usuário na autenticação do Supabase
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: senha,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        nome: nome,
        role: role
      }
    })

    if (authError) {
      console.error('❌ Erro ao criar usuário na auth:', authError)
      
      // Mensagem mais específica para email duplicado
      if (authError.message.includes('Database error creating new user')) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Este e-mail já está cadastrado no sistema'
        })
      }
      
      throw createError({
        statusCode: 400,
        statusMessage: `Erro ao criar usuário: ${authError.message}`
      })
    }

    if (!authUser.user) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Usuário não foi criado corretamente'
      })
    }

    console.log('✅ Usuário criado na auth:', authUser.user.id)

    // Passo 2: Inserir perfil na tabela ag_profiles
    const profileInsertData = {
      user_id: authUser.user.id,
      nome: nome as string,
      role: role as string,
      email: email as string
    }

    const { data: profileData, error: profileError } = await (supabaseAdmin as any)
      .from('ag_profiles')
      .insert(profileInsertData)
      .select()
      .single()

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError)
      
      // Se falhou ao criar perfil, deletar usuário da auth para manter consistência
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      
      throw createError({
        statusCode: 500,
        statusMessage: `Erro ao criar perfil: ${profileError.message}`
      })
    }

    console.log('✅ Perfil criado:', profileData)

    // Retornar dados do usuário criado
    return {
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user_id: authUser.user.id,
        email: authUser.user.email,
        profile: profileData
      }
    }

  } catch (error: any) {
    console.error('💥 Erro na API de criação de usuário:', error)
    
    // Se for um erro já tratado, retornar como está
    if (error.statusCode) {
      throw error
    }

    // Erro genérico
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
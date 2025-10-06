/**
 * PROPÓSITO: Middleware para proteger rotas que só admins podem acessar
 * IMPORTA: useAuth
 * USADO_POR: Páginas que requerem role admin
 */

import { useAuth } from '../shared/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { user, isAdmin } = useAuth()

  // Verificar se usuário está logado
  if (!user.value) {
    return navigateTo('/login')
  }

  // Verificar se é admin
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    return navigateTo('/')
  }
})
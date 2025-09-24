/**
 * PROPÓSITO: Plugin para inicializar dados do perfil do usuário no Pinia
 * IMPORTA: Pinia store, Supabase Auth
 * USADO_POR: Aplicação durante inicialização (client-side)
 */

export default defineNuxtPlugin(async () => {
  const { $pinia } = useNuxtApp()
  const user = useSupabaseUser()
  
  // Importa dinamicamente o store
  const { useProfileStore } = await import('../shared/stores/useProfileStore')
  const profileStore = useProfileStore($pinia)

  // Aguarda hidratação para evitar problemas de SSR
  await nextTick()

  // Debug log
  console.log('Plugin init-profile executado, usuário:', user.value)

  // Se houver usuário logado, busca o perfil
  if (user.value?.id) {
    console.log('Buscando perfil para user_id:', user.value.id)
    const profile = await profileStore.fetchProfileByUserId(user.value.id)
    console.log('Perfil carregado:', profile)
  }

  // Watch para mudanças no usuário
  watch(user, async (newUser, oldUser) => {
    console.log('Usuário mudou:', { oldUser: oldUser?.id, newUser: newUser?.id })
    
    if (newUser?.id) {
      console.log('Carregando perfil para novo usuário:', newUser.id)
      const profile = await profileStore.fetchProfileByUserId(newUser.id)
      console.log('Novo perfil carregado:', profile)
    } else {
      console.log('Usuário deslogou, resetando store')
      profileStore.$reset()
    }
  }, { immediate: false })
})
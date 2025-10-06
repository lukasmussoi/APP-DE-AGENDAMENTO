/**
 * PROPÓSITO: Página de administração do sistema
 * IMPORTA: Vue 3, Nuxt
 * USADO_POR: Usuários com role admin
 */

<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Administração</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Página de administração do sistema de agendamentos.</p>
        <!-- Aqui você pode adicionar conteúdo específico para admins -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Verificar se usuário é admin ao carregar a página
onMounted(async () => {
  const user = useSupabaseUser()
  if (user.value) {
    const supabase = useSupabaseClient()
    const { data: profile } = await supabase
      .from('ag_profiles')
      .select('role')
      .eq('user_id', user.value.id)
      .single()

    if (!profile || (profile as any).role !== 'admin') {
      // Redirecionar se não for admin
      await navigateTo('/')
    }
  } else {
    // Redirecionar se não estiver logado
    await navigateTo('/login')
  }
})
</script>
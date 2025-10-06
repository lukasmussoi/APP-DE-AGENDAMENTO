/**
 * PROPÓSITO: Página inicial do dashboard
 * IMPORTA: useProfileStore (Pinia)
 * USADO_POR: Rota /
 */

<template>
  <div>
    <h1>Dashboard</h1>
    
    <!-- Debug Info -->
    <div class="bg-gray-100 p-4 mb-4 rounded">
      <h3>Debug Info:</h3>
      <client-only>
        <p><strong>User:</strong> {{ user ? user.id : 'Não logado' }}</p>
        <p><strong>Profile Loading:</strong> {{ profileStore.loading }}</p>
        <p><strong>Profile Error:</strong> {{ profileStore.error }}</p>
        <p><strong>Current Profile:</strong> {{ profileStore.currentProfile }}</p>
        <template #fallback>
          <p>Carregando informações...</p>
        </template>
      </client-only>
    </div>
    
    <!-- Status do Profile -->
    <client-only>
      <div v-if="profileStore.loading">
        <p>Carregando perfil...</p>
      </div>
      <div v-else-if="profileStore.currentProfile">
        <p>Bem-vindo, <strong>{{ profileStore.currentProfile.nome }}</strong>!</p>
        <p>Role: {{ profileStore.currentProfile.role }}</p>
      </div>
      <div v-else-if="profileStore.error">
        <p>Erro: {{ profileStore.error }}</p>
      </div>
      <div v-else>
        <p>Nenhum perfil encontrado</p>
        <button @click="forceLoadProfile" class="bg-blue-500 text-white px-4 py-2 rounded">
          Tentar Carregar Perfil Manualmente
        </button>
      </div>
      <template #fallback>
        <p>Carregando perfil...</p>
      </template>
    </client-only>
  </div>
</template>

<script setup lang="ts">
// Import explícito do store do Pinia
import { useProfileStore } from '../shared/stores/useProfileStore'

// User do Supabase
const user = useSupabaseUser()

// Store do Pinia
const profileStore = useProfileStore()

// Função para forçar carregamento manual do perfil
const forceLoadProfile = async () => {
  if (user.value?.id) {
    console.log('Forçando carregamento do perfil para:', user.value.id)
    await profileStore.fetchProfileByUserId(user.value.id)
  } else {
    console.log('Nenhum usuário logado')
  }
}

// Log inicial para debug
if (process.client) {
  console.log('Página carregada - User:', user.value)
  console.log('Profile store state:', {
    loading: profileStore.loading,
    currentProfile: profileStore.currentProfile,
    error: profileStore.error
  })
}

// Layout é aplicado automaticamente pelo Nuxt 4
</script>
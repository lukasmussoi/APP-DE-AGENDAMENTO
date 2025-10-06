/**
 * PROPÓSITO: Página de administração do sistema
 * IMPORTA: Vue 3, Nuxt, composables de usuários
 * USADO_POR: Usuários com role admin
 */

<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Administração</h1>
        <p class="text-gray-600">Painel de administração do sistema de agendamentos</p>
      </div>

      <!-- Tabela de usuários -->
      <div class="bg-white rounded-lg shadow p-6">
        <TabelaUsuarios
          :usuarios="usuariosLista"
          :loading="loading"
          :error="error"
          @retry="handleRetry"
          @usuario-criado="handleUsuarioCriado"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { useUsuarios } from '../modules/usuarios/composables/usuarios'
import TabelaUsuarios from '../modules/usuarios/components/TabelaUsuarios.vue'

// Aplicar middleware de admin para proteger a página
definePageMeta({
  middleware: 'admin' as any
})

// Composable para gerenciar usuários
const { usuariosLista, loading, error, fetchUsuariosAdmin } = useUsuarios()

// Store do perfil
const { useProfileStore } = await import('../shared/stores/useProfileStore')
const profileStore = useProfileStore()

// Carregar dados quando o componente for montado
// O middleware já garante que o usuário é admin quando chega aqui
onMounted(async () => {
  // Aguardar um pouco para garantir que o perfil foi carregado
  if (!profileStore.currentProfile) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  if (profileStore.currentProfile?.role === 'admin') {
    await fetchUsuariosAdmin()
  }
})

// Handler para retry
const handleRetry = async () => {
  await fetchUsuariosAdmin()
}

// Handler para quando um usuário é criado
const handleUsuarioCriado = async () => {
  console.log('Usuário criado! Recarregando lista...')
  await fetchUsuariosAdmin()
  // Removido toast aqui - apenas o toast de sucesso da criação é suficiente
}
</script>
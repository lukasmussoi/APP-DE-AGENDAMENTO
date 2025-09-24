/**
 * PROPÓSITO: Sidebar de navegação lateral fixa da aplicação
 * IMPORTA: Componentes UI e Vue 3
 * USADO_POR: Layouts que precisam de navegação lateral
 */

<template>
  <aside class="fixed top-0 left-0 w-64 h-screen bg-white shadow-lg border-r border-gray-200 flex flex-col z-10">
    <!-- Logo Section -->
    <div class="p-6 border-b border-gray-200">
      <NuxtLink to="/" class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold text-xl">A</span>
        </div>
        <div class="flex flex-col">
          <span class="text-lg font-semibold text-gray-900">Agendamento</span>
          <span class="text-xs text-gray-500">Sistema de Gestão</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <!-- Dashboard -->
      <NuxtLink
        to="/"
        class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
        active-class="bg-blue-100 text-blue-800"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
        Dashboard
      </NuxtLink>

      <!-- Especialidades -->
      <NuxtLink
        to="/especialidades"
        class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
        active-class="bg-blue-100 text-blue-800"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Especialidades
      </NuxtLink>

      <!-- Agendamentos -->
      <NuxtLink
        to="/agendamentos"
        class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
        active-class="bg-blue-100 text-blue-800"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-8 0H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-4" />
        </svg>
        Agendamentos
      </NuxtLink>

      <!-- Clientes -->
      <NuxtLink
        to="/clientes"
        class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
        active-class="bg-blue-100 text-blue-800"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Clientes
      </NuxtLink>

      <!-- Profissionais -->
      <NuxtLink
        to="/profissionais"
        class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
        active-class="bg-blue-100 text-blue-800"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4m0 2v2M6 8v10a2 2 0 002 2h8a2 2 0 002-2V8M6 8h.01" />
        </svg>
        Profissionais
      </NuxtLink>
    </nav>

    <!-- User Info & Logout -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center space-x-3 mb-3">
        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span class="text-sm font-medium text-blue-600">
            {{ userInitials }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ user?.email?.split('@')[0] || 'Usuário' }}
          </p>
          <p class="text-xs text-gray-500 truncate">
            {{ user?.email || '' }}
          </p>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
        :disabled="isLoggingOut"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span v-if="isLoggingOut">Saindo...</span>
        <span v-else>Sair</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

// Auth composable
const { user, logout } = useAuth()
const isLoggingOut = ref(false)

// Computed para iniciais do usuário
const userInitials = computed(() => {
  const email = user.value?.email
  if (!email) return 'U'

  const name = email.split('@')[0]
  return name ? name.charAt(0).toUpperCase() : 'U'
})

// Função de logout
const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    await logout()
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>
/**
 * PROPÓSITO: Header/navbar da aplicação
 * IMPORTA: Componentes UI compartilhados
 * USADO_POR: Layout principal da aplicação
 */

<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">A</span>
            </div>
            <span class="text-xl font-semibold text-gray-900">Agendamento</span>
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            to="/"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            active-class="text-blue-600"
          >
            Início
          </NuxtLink>
          <NuxtLink 
            to="/agendamentos"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            active-class="text-blue-600"
          >
            Agendamentos
          </NuxtLink>
          <NuxtLink 
            to="/clientes"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            active-class="text-blue-600"
          >
            Clientes
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Quando não está autenticado -->
          <template v-if="!isAuthenticated">
            <Button variant="outline" size="sm" @click="goToLogin">
              Login
            </Button>
            <Button size="sm">
              Cadastro
            </Button>
          </template>

          <!-- Quando está autenticado -->
          <template v-else>
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-700">
                Olá, {{ user?.email?.split('@')[0] }}
              </span>
              <Button variant="outline" size="sm" @click="handleLogout" :disabled="isLoggingOut">
                <span v-if="isLoggingOut">Saindo...</span>
                <span v-else>Sair</span>
              </Button>
            </div>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          <NuxtLink 
            to="/"
            class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            active-class="text-blue-600"
            @click="isMobileMenuOpen = false"
          >
            Início
          </NuxtLink>
          <NuxtLink 
            to="/agendamentos"
            class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            active-class="text-blue-600"
            @click="isMobileMenuOpen = false"
          >
            Agendamentos
          </NuxtLink>
          <NuxtLink 
            to="/clientes"
            class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            active-class="text-blue-600"
            @click="isMobileMenuOpen = false"
          >
            Clientes
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const isMobileMenuOpen = ref(false)

// Auth composable
const { isAuthenticated, user, logout } = useAuth()
const isLoggingOut = ref(false)

// Funções de navegação
const goToLogin = () => {
  navigateTo('/login')
}

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
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
        <HomeIcon class="w-5 h-5 mr-3" />
        Dashboard
      </NuxtLink>

      <!-- Especialidades -->
      <NuxtLink
        to="/especialidades"
        class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
        active-class="bg-blue-100 text-blue-800"
      >
        <FolderIcon class="w-5 h-5 mr-3" />
        Especialidades
      </NuxtLink>

      <!-- Agendamentos -->
      <NuxtLink
        to="/agendamentos"
        class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
        active-class="bg-blue-100 text-blue-800"
      >
        <CalendarDaysIcon class="w-5 h-5 mr-3" />
        Agendamentos
      </NuxtLink>

      <!-- Clientes -->
      <NuxtLink
        to="/clientes"
        class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
        active-class="bg-blue-100 text-blue-800"
      >
        <UsersIcon class="w-5 h-5 mr-3" />
        Clientes
      </NuxtLink>

      <!-- Profissionais -->
      <NuxtLink
        to="/profissionais"
        class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
        active-class="bg-blue-100 text-blue-800"
      >
        <BriefcaseIcon class="w-5 h-5 mr-3" />
        Profissionais
      </NuxtLink>
    </nav>

    <!-- User Menu Dropdown -->
    <div class="p-4 border-t border-gray-200">
      <MenuDropdown :user="user" :on-logout="handleLogout" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'
import {
  HomeIcon,
  FolderIcon,
  CalendarDaysIcon,
  UsersIcon,
  BriefcaseIcon
} from '@heroicons/vue/24/outline'
import MenuDropdown from '../ui/MenuDropdown.vue'

// Auth composable
const { user, logout } = useAuth()

// Função de logout
const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}
</script>
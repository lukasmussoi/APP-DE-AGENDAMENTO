/**
 * PROPÓSITO: Sidebar de navegação lateral fixa da aplicação
 * IMPORTA: Componentes UI e Vue 3
 * USADO_POR: Layouts que precisam de navegação lateral
 */

<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-screen bg-white shadow-lg border-r border-gray-200 flex flex-col z-10 transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Header with Toggle Button -->
    <div :class="[
      'border-b border-gray-200 flex items-center',
      isCollapsed ? 'p-2 justify-center' : 'p-4 justify-between'
    ]">
      <!-- Logo Section quando expandida -->
      <div v-if="!isCollapsed" class="flex items-center space-x-3 flex-1">
        <NuxtLink to="/" class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-white font-bold text-lg">A</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-gray-900">Agendamento</span>
            <span class="text-xs text-gray-500">Sistema</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Logo quando colapsada -->
      <div v-if="isCollapsed" class="flex flex-col items-center space-y-2">
        <NuxtLink to="/" class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">A</span>
        </NuxtLink>
      </div>

      <!-- Toggle Button -->
      <button
        v-if="!isCollapsed"
        @click="toggleSidebar"
        class="p-1 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
        title="Recolher sidebar"
      >
        <ChevronLeftIcon class="w-5 h-5 text-gray-500" />
      </button>

      <!-- Toggle Button quando colapsada -->
      <button
        v-if="isCollapsed"
        @click="toggleSidebar"
        class="p-1 rounded-md hover:bg-gray-100 transition-colors mt-2"
        title="Expandir sidebar"
      >
        <ChevronLeftIcon class="w-4 h-4 text-gray-500 rotate-180" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
      <!-- Dashboard -->
      <NuxtLink
        to="/"
        :class="[
          'flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors',
          isCollapsed ? 'justify-center' : '',
          'group'
        ]"
        active-class="bg-blue-100 text-blue-800"
        :title="isCollapsed ? 'Dashboard' : ''"
      >
        <HomeIcon class="w-5 h-5 flex-shrink-0" :class="isCollapsed ? '' : 'mr-3'" />
        <span v-if="!isCollapsed" class="transition-opacity duration-200">Dashboard</span>
      </NuxtLink>

      <!-- Especialidades -->
      <NuxtLink
        to="/especialidades"
        :class="[
          'flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors',
          isCollapsed ? 'justify-center' : '',
          'group'
        ]"
        active-class="bg-blue-100 text-blue-800"
        :title="isCollapsed ? 'Especialidades' : ''"
      >
        <FolderIcon class="w-5 h-5 flex-shrink-0" :class="isCollapsed ? '' : 'mr-3'" />
        <span v-if="!isCollapsed" class="transition-opacity duration-200">Especialidades</span>
      </NuxtLink>

      <!-- Agendamentos -->
      <div>
        <button
          @click="toggleAgendamentosSubmenu"
          :class="[
            'flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors w-full text-left',
            isCollapsed ? 'justify-center' : '',
            'group'
          ]"
          :title="isCollapsed ? 'Agendamentos' : ''"
        >
          <CalendarDaysIcon class="w-5 h-5 flex-shrink-0" :class="isCollapsed ? '' : 'mr-3'" />
          <span v-if="!isCollapsed" class="transition-opacity duration-200 flex-1">Agendamentos</span>
          <ChevronDownIcon v-if="!isCollapsed" :class="['w-4 h-4 transition-transform', isAgendamentosSubmenuOpen ? 'rotate-180' : '']" />
        </button>

        <!-- Submenu -->
        <div v-if="isAgendamentosSubmenuOpen && !isCollapsed" class="ml-8 mt-1 space-y-1">
          <NuxtLink
            to="/agendamentos"
            class="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
            active-class="bg-blue-100 text-blue-800"
          >
            Gerenciar
          </NuxtLink>
          <NuxtLink
            to="/relatorio-agendamentos"
            class="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
            active-class="bg-blue-100 text-blue-800"
          >
            Relatório
          </NuxtLink>
        </div>
      </div>

      <!-- Clientes -->
      <NuxtLink
        to="/clientes"
        :class="[
          'flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors',
          isCollapsed ? 'justify-center' : '',
          'group'
        ]"
        active-class="bg-blue-100 text-blue-800"
        :title="isCollapsed ? 'Clientes' : ''"
      >
        <UsersIcon class="w-5 h-5 flex-shrink-0" :class="isCollapsed ? '' : 'mr-3'" />
        <span v-if="!isCollapsed" class="transition-opacity duration-200">Clientes</span>
      </NuxtLink>

      <!-- Profissionais -->
      <NuxtLink
        to="/profissionais"
        :class="[
          'flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors',
          isCollapsed ? 'justify-center' : '',
          'group'
        ]"
        active-class="bg-blue-100 text-blue-800"
        :title="isCollapsed ? 'Profissionais' : ''"
      >
        <BriefcaseIcon class="w-5 h-5 flex-shrink-0" :class="isCollapsed ? '' : 'mr-3'" />
        <span v-if="!isCollapsed" class="transition-opacity duration-200">Profissionais</span>
      </NuxtLink>

      <!-- Admin (só para admins) -->
      <NuxtLink
        v-if="isAdmin"
        to="/admin"
        :class="[
          'flex items-center px-3 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors',
          isCollapsed ? 'justify-center' : '',
          'group'
        ]"
        active-class="bg-blue-100 text-blue-800"
        :title="isCollapsed ? 'Admin' : ''"
      >
        <CogIcon class="w-5 h-5 flex-shrink-0" :class="isCollapsed ? '' : 'mr-3'" />
        <span v-if="!isCollapsed" class="transition-opacity duration-200">Admin</span>
      </NuxtLink>
    </nav>

    <!-- User Menu Dropdown -->
    <div class="p-3 border-t border-gray-200">
      <MenuDropdown :user="user" :on-logout="handleLogout" :is-collapsed="isCollapsed" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useProfileStore } from '../../stores/useProfileStore'
import {
  HomeIcon,
  FolderIcon,
  CalendarDaysIcon,
  UsersIcon,
  BriefcaseIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import MenuDropdown from '../ui/MenuDropdown.vue'

// Emits
const emit = defineEmits<{
  toggle: [collapsed: boolean]
}>()

// Auth composable
const { user, logout, isAdmin: checkIsAdmin } = useAuth()
const profileStore = useProfileStore()

// Estado reativo para admin
const isAdmin = ref(false)

// Sidebar state
const isCollapsed = ref(false)
const isAgendamentosSubmenuOpen = ref(false)

// Função para verificar admin
const verificarAdmin = async () => {
  if (user.value) {
    const adminResult = await checkIsAdmin()
    if (adminResult.success) {
      isAdmin.value = adminResult.isAdmin
    }
  } else {
    isAdmin.value = false
  }
}

// Buscar perfil e verificar admin ao montar
onMounted(async () => {
  if (user.value) {
    await profileStore.fetchProfileByUserId(user.value.id)
    await verificarAdmin()
  }
})

// Observar mudanças no usuário
watch(user, async (newUser) => {
  if (newUser) {
    await profileStore.fetchProfileByUserId(newUser.id)
    await verificarAdmin()
  } else {
    isAdmin.value = false
  }
}, { immediate: true })

// Toggle sidebar function
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  emit('toggle', isCollapsed.value)
}

// Toggle agendamentos submenu
const toggleAgendamentosSubmenu = () => {
  isAgendamentosSubmenuOpen.value = !isAgendamentosSubmenuOpen.value
}

// Função de logout
const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}
</script>
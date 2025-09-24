/**
 * PROPÓSITO: Menu dropdown para ações do usuário
 * IMPORTA: Vue 3, Heroicons
 * USADO_POR: Sidebar component
 */

<template>
  <div class="relative">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      :class="[
        'flex items-center rounded-lg hover:bg-gray-50 transition-colors',
        props.isCollapsed ? 'justify-center p-2' : 'w-full space-x-3 p-3'
      ]"
    >
      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-sm font-medium text-blue-600">
          {{ userInitials }}
        </span>
      </div>
      <div v-if="!props.isCollapsed" class="flex-1 min-w-0 text-left">
        <p class="text-sm font-medium text-gray-900 truncate">
          {{ userName }}
        </p>
        <p class="text-xs text-gray-500 truncate">
          {{ userEmail }}
        </p>
      </div>
      <ChevronDownIcon
        v-if="!props.isCollapsed"
        class="w-4 h-4 text-gray-400 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      :class="[
        'absolute bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20',
        props.isCollapsed ? 'left-0 w-48' : 'left-0 w-full'
      ]"
    >
      <!-- Perfil Button -->
      <button
        @click="handleProfile"
        class="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <UserIcon class="w-4 h-4 mr-3 text-gray-500" />
        Perfil
      </button>

      <!-- Divider -->
      <div class="border-t border-gray-100 my-1"></div>

      <!-- Sair Button -->
      <button
        @click="handleLogout"
        class="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
        :disabled="isLoggingOut"
      >
        <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3" />
        <span v-if="isLoggingOut">Saindo...</span>
        <span v-else>Sair</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

// Props
interface Props {
  user?: {
    email?: string
    name?: string
  } | null
  onLogout?: () => Promise<void>
  isCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  onLogout: async () => {},
  isCollapsed: false
})

// State
const isOpen = ref(false)
const isLoggingOut = ref(false)

// Computed
const userName = computed(() => {
  if (props.user?.name) return props.user.name
  if (props.user?.email) return props.user.email.split('@')[0]
  return 'Usuário'
})

const userEmail = computed(() => {
  return props.user?.email || ''
})

const userInitials = computed(() => {
  const name = userName.value
  return name ? name.charAt(0).toUpperCase() : 'U'
})

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleProfile = () => {
  // TODO: Implementar navegação para perfil
  console.log('Navegar para perfil')
  isOpen.value = false
}

const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    await props.onLogout()
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  } finally {
    isLoggingOut.value = false
    isOpen.value = false
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
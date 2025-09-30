/**
 * PROPÓSITO: Layout específico para página de agendamentos com design moderno
 * IMPORTA: Componentes de layout compartilhados
 * USADO_POR: Página de agendamentos
 */

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative overflow-hidden">
    <!-- Subtle background pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0); background-size: 20px 20px;"></div>
    </div>
    
    <!-- Sidebar Fixo -->
    <Sidebar @toggle="handleSidebarToggle" />

    <!-- Main Content -->
    <main :class="['flex flex-col min-h-screen transition-all duration-300 ease-in-out relative z-10', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Page Content -->
      <div class="flex-1 p-4 lg:p-6 overflow-auto">
        <!-- Content wrapper com shadow sutil -->
        <div class="w-full h-full bg-white/30 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
          <slot />
        </div>
      </div>
    </main>

    <!-- Teleports Container - Para modais e outros elementos que precisam ser teleportados -->
    <div id="teleports"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Importar componentes de layout
import Sidebar from '../shared/components/layout/Sidebar.vue'

// Estado da sidebar
const isSidebarCollapsed = ref(false)

// Handler para toggle da sidebar
const handleSidebarToggle = (collapsed: boolean) => {
  isSidebarCollapsed.value = collapsed
}
</script>
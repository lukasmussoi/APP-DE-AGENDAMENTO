/**
 * PROPÓSITO: Layout padrão da aplicação com sidebar fixo
 * IMPORTA: Componentes de layout compartilhados
 * USADO_POR: Todas as páginas que usam o layout default
 */

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar Fixo -->
    <Sidebar @toggle="handleSidebarToggle" />

    <!-- Main Content -->
    <main :class="['flex flex-col min-h-screen transition-all duration-300 ease-in-out', isSidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Page Content -->
      <div class="flex-1 p-6 overflow-auto">
        <slot />
      </div>

      <!-- Footer -->
      <Footer />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Importar componentes de layout
import Sidebar from '../shared/components/layout/Sidebar.vue'
import Footer from '../shared/components/layout/Footer.vue'

// Estado da sidebar
const isSidebarCollapsed = ref(false)

// Handler para toggle da sidebar
const handleSidebarToggle = (collapsed: boolean) => {
  isSidebarCollapsed.value = collapsed
}
</script>
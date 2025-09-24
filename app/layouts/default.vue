/**
 * PROPÓSITO: Layout padrão da aplicação com sidebar fixo
 * IMPORTA: Componentes de layout compartilhados
 * USADO_POR: Todas as páginas que usam o layout default
 */

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar Fixo -->
    <Sidebar />

    <!-- Main Content -->
    <main class="ml-64 flex flex-col min-h-screen">
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
// Importar componentes de layout
import Sidebar from '../shared/components/layout/Sidebar.vue'
import Footer from '../shared/components/layout/Footer.vue'
</script>
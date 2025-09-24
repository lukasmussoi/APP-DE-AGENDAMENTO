/**
 * PROPÓSITO: Layout padrão da aplicação com header, sidebar e footer
 * IMPORTA: Componentes de layout compartilhados
 * USADO_POR: Todas as páginas que usam o layout default
 */

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Main Content Area -->
    <div class="flex flex-1">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <main class="flex-1 flex flex-col">
        <!-- Header -->
        <Header />
        
        <!-- Page Content -->
        <div class="flex-1 p-6 overflow-auto">
          <slot />
        </div>
      </main>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
// Importar componentes de layout
import Header from '../shared/components/layout/Header.vue'
import Sidebar from '../shared/components/layout/Sidebar.vue'
import Footer from '../shared/components/layout/Footer.vue'
</script>
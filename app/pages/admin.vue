/**
 * PROPÓSITO: Página de administração do sistema
 * IMPORTA: Vue 3, Nuxt
 * USADO_POR: Usuários com role admin
 */

<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Administração</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Página de administração do sistema de agendamentos.</p>
        <!-- Aqui você pode adicionar conteúdo específico para admins -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Aplicar middleware de admin para proteger a página
definePageMeta({
  middleware: 'admin' as any
})
</script>
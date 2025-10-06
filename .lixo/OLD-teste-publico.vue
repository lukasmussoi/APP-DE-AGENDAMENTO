/**
 * PROPÓSITO: Página de teste pública
 * IMPORTA: Nenhum
 * USADO_POR: Teste de acessibilidade sem login
 */

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900">Página Pública de Teste</h1>
      <p class="mt-2 text-gray-600">Esta página deve ser acessível sem login</p>
      <div class="mt-4">
        <NuxtLink to="/esqueci-senha" class="text-blue-600 hover:text-blue-800">
          Ir para Esqueci Senha
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
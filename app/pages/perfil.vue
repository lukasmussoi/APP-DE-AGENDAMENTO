/**
 * PROPÓSITO: Página de perfil do usuário para edição de dados pessoais
 * IMPORTA: Componente PerfilForm do módulo usuarios
 * USADO_POR: Menu de navegação lateral
 */

<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Perfil do Usuário</h1>

      <PerfilForm />
    </div>
  </div>
</template>

<script setup lang="ts">
// Definir layout padrão
definePageMeta({
  layout: 'default'
})

// Importar componente do módulo usuarios
import PerfilForm from '~/modules/usuarios/components/PerfilForm.vue'
</script>
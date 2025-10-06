/**
 * PROPÓSITO: Layout vazio para páginas públicas que não precisam de autenticação
 * IMPORTA: Nenhum
 * USADO_POR: Páginas públicas como login, esqueci-senha, etc.
 */

<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
// Layout vazio - apenas renderiza o conteúdo da página
</script>
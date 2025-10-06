/**
 * PROPÓSITO: Componente base para tabelas
 * IMPORTA: Nenhum
 * USADO_POR: DataTable, outras tabelas customizadas
 */
<template>
  <table class="w-full text-sm text-left text-neutral-700">
    <slot />
  </table>
</template>

<script setup lang="ts">
// Componente base para tabelas - apenas wrapper sem lógica
</script>
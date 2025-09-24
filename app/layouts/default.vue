/**
 * PROPÓSITO: Layout padrão da aplicação com header e footer
 * IMPORTA: Componentes de layout compartilhados
 * USADO_POR: Todas as páginas que usam o layout default
 */

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Layout sem lógica específica - apenas estrutural
</script>
/**
 * PROPÓSITO: Componente Card genérico para agrupar conteúdo
 * IMPORTA: Tailwind classes do design system
 * USADO_POR: Layouts e páginas para mostrar blocos de informação
 */
<template>
  <div :class="['bg-white rounded-lg shadow p-4', className]">
    <div v-if="$slots.header" class="mb-3">
      <slot name="header" />
    </div>
    <div>
      <slot />
    </div>
    <div v-if="$slots.footer" class="mt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({ className: { type: String, default: '' } })
</script>
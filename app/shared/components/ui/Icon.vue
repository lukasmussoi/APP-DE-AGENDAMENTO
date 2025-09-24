/**
 * PROPÓSITO: Wrapper simples para ícones SVG
 * IMPORTA: Recebe um slot SVG ou nome para seleção futura
 * USADO_POR: Botões e indicadores
 */
<template>
  <span :class="['inline-flex items-center', className]" aria-hidden="true">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = defineProps({ className: { type: String, default: '' } })
</script>

/**
 * PROPÓSITO: Badge simples para status/indicadores
 * IMPORTA: Cores do design system
 * USADO_POR: Indicadores de status em listas e cards
 */
<template>
  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variantClass]">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  variant: { type: String as () => 'neutral' | 'success' | 'warning' | 'error' | 'info', default: 'neutral' }
})

const variantClassMap: Record<string, string> = {
  neutral: 'bg-neutral-100 text-neutral-800',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  error: 'bg-error-50 text-error-600',
  info: 'bg-info-50 text-info-600'
}

const variantClass = variantClassMap[props.variant]
</script>

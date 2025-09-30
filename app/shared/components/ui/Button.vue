/**
 * PROPÓSITO: Componente de botão reutilizável
 * IMPORTA: Tailwind classes do design system
 * USADO_POR: Páginas e outros componentes da UI
 */
<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String as () => 'solid' | 'outline' | 'ghost' | 'danger' | 'primary' | 'success' | 'warning' | 'info', default: 'solid' },
  size: { type: String as () => 'sm' | 'md' | 'lg', default: 'md' },
  disabled: { type: Boolean, default: false },
  type: { type: String as () => 'button' | 'submit' | 'reset', default: 'button' }
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants: Record<string, string> = {
    solid: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow',
    info: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 shadow',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow'
  }

  const sizes: Record<string, string> = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-3'
  }

  const disabledCls = props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''

  return [base, variants[props.variant], sizes[props.size], disabledCls].filter(Boolean).join(' ')
})
</script>
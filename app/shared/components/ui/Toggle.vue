/**
 * PROPÓSITO: Toggle switch simples
 * IMPORTA: Tailwind classes do design system
 * USADO_POR: Preferências e opções binárias
 */
<template>
  <button type="button" :class="['relative inline-flex items-center h-6 rounded-full transition-colors focus:outline-none', buttonClass]" @click="toggle" :aria-pressed="modelValue">
    <span class="sr-only">Toggle</span>
    <span :class="['inline-block w-5 h-5 bg-white rounded-full transform transition-transform', knobClass]" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])

const buttonClass = computed(() => props.modelValue ? 'bg-primary-600' : 'bg-neutral-300')
const knobClass = computed(() => props.modelValue ? 'translate-x-1' : '-translate-x-0')

function toggle() { emit('update:modelValue', !props.modelValue) }
</script>

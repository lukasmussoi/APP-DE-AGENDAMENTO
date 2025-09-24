/**
 * PROPÓSITO: Componente de input controlado e estilizado
 * IMPORTA: Tailwind classes do design system, Heroicons
 * USADO_POR: Formulários e páginas
 */
<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-neutral-700 mb-1">{{ label }}</label>
    <div class="relative">
      <div v-if="startIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="startIcon" class="h-5 w-5 text-neutral-400" />
      </div>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="onInput"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        :style="{ paddingLeft: startIcon ? '2.5rem' : '0.75rem', paddingRight: endIcon ? '2.5rem' : '0.75rem' }"
      />
      <div v-if="endIcon" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <component :is="endIcon" class="h-5 w-5 text-neutral-400 cursor-pointer hover:text-neutral-600" @click="onEndIconClick" />
      </div>
    </div>
    <p v-if="help" class="text-xs text-neutral-500 mt-1">{{ help }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, default: () => `input-${Math.random().toString(36).substr(2, 9)}` },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  help: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  type: { type: String as () => 'text' | 'email' | 'tel' | 'password' | 'number', default: 'text' },
  startIcon: { type: [Object, Function], default: null },
  endIcon: { type: [Object, Function], default: null }
})

const inputClasses = computed(() => {
  const base = 'block w-full rounded-md border px-3 py-2 text-sm bg-white text-neutral-900 placeholder-neutral-400'
  const focus = 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  return [base, focus, disabled].filter(Boolean).join(' ')
})

const emit = defineEmits(['update:modelValue', 'end-icon-click'])

function onInput(e: Event) {
  const target = e.target as HTMLInputElement | null
  if (!target) return
  emit('update:modelValue', target.value)
}

function onEndIconClick() {
  emit('end-icon-click')
}
</script>

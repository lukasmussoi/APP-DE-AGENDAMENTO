/**
 * PROPÓSITO: Componente para exibir um item de dia da semana
 * IMPORTA: Nenhum
 * USADO_POR: SemanaDias
 */

<template>
  <div class="dia-item text-center py-2 text-sm border-r border-gray-200 last:border-r-0">
    <p class="font-medium text-gray-700">{{ diaAbreviado }}</p>
    <p class="text-lg font-semibold text-gray-900">{{ numeroDia }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  dia: Date
}>()

// Computed para dia abreviado
const diaAbreviado = computed(() => {
  return props.dia.toLocaleDateString('pt-BR', { weekday: 'short' })
})

// Computed para número do dia
const numeroDia = computed(() => {
  return props.dia.getDate()
})
</script>
/**
 * PROPÓSITO: Componente para exibir um item de dia da semana
 * IMPORTA: Nenhum
 * USADO_POR: SemanaDias
 */

<template>
  <div class="dia-item text-center p-1 text-sm">
    <p class="font-medium">{{ diaAbreviado }}</p>
    <p>{{ numeroDia }}</p>
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
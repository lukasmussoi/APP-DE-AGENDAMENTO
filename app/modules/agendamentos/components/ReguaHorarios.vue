/**
 * PROPÓSITO: Componente para exibir régua de horários de 8h às 22h
 * IMPORTA: Nenhum
 * USADO_POR: AgendamentoManager
 */

<template>
  <div class="regua-horarios w-20 bg-gray-100 border-r border-gray-300">
    <div
      v-for="hora in horarios"
      :key="hora"
      class="text-center h-16 text-sm font-medium text-gray-700 border-b border-gray-200 flex items-center justify-center"
    >
      {{ hora }}:00
    </div>
  </div>
</template>

<script setup lang="ts">
// Gerar array de horários de 8 às 22
const horarios = computed(() => {
  const horas = []
  for (let i = 8; i <= 22; i++) {
    horas.push(i)
  }
  return horas
})
</script>
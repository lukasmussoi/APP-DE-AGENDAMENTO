/**
 * PROPÓSITO: Componente para representar um slot de agendamento
 * IMPORTA: Nenhum
 * USADO_POR: ItemAgendamento
 */

<template>
  <div
    class="slot bg-blue-100 border border-blue-300 rounded overflow-hidden absolute left-0 right-0"
    :style="{ top: topPosition + 'px', height: slotHeight + 'px' }"
  >
    <div
      class="h-full flex flex-col"
      :class="slotHeight < 40 ? 'p-0.5 justify-start' : 'p-1 justify-center'"
    >
      <div class="flex items-center justify-between">
        <h4
          class="font-semibold text-blue-900 truncate flex-1"
          :class="slotHeight < 40 ? 'text-xs' : 'text-sm'"
        >
          {{ title }}
        </h4>
        <p
          class="text-xs text-blue-600 ml-1 flex-shrink-0"
        >
          {{ start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }} -
          {{ end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }}
        </p>
      </div>
      <p
        v-if="slotHeight > 50"
        class="text-xs text-blue-700 truncate mt-0.5"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  start: Date
  end: Date
  title: string
  description: string
}>()

// Altura por hora em pixels
const alturaPorHora = 64

// Calcular posição top baseada na hora de início
const topPosition = computed(() => {
  const horaInicio = props.start.getHours()
  const minutosInicio = props.start.getMinutes()
  const horasDesde8 = horaInicio - 8
  return (horasDesde8 * alturaPorHora) + (minutosInicio * (alturaPorHora / 60))
})

// Calcular altura baseada na duração
const slotHeight = computed(() => {
  const duracaoMs = props.end.getTime() - props.start.getTime()
  const duracaoMinutos = duracaoMs / (1000 * 60)
  return duracaoMinutos * (alturaPorHora / 60)
})
</script>
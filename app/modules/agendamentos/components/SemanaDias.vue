/**
 * PROPÓSITO: Componente para exibir lista de dias da semana
 * IMPORTA: DiaItem
 * USADO_POR: AgendamentoManager
 */

<template>
  <div class="semana-dias border border-gray-300 rounded bg-white">
    <div class="grid grid-cols-7">
      <DiaItem
        v-for="(dia, index) in dias"
        :key="index"
        :dia="dia"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar componente DiaItem
import DiaItem from './DiaItem.vue'

defineProps<{
  dias: Date[]
}>()
</script>
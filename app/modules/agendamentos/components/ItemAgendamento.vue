/**
 * PROPÓSITO: Componente para exibir item de agendamento para um dia específico
 * IMPORTA: Nenhum
 * USADO_POR: AgendamentoManager
 */

<template>
  <div class="item-agendamento border border-gray-300 bg-white min-h-[400px]">
    <!-- Espaço para agendamentos do dia -->
    <div class="p-2">
      <p class="text-sm text-gray-600">{{ data.toLocaleDateString('pt-BR') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: Date
}>()
</script>
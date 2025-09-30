/**
 * PROPÓSITO: Componente para exibir item de agendamento para um dia específico
 * IMPORTA: Slot
 * USADO_POR: AgendamentoManager
 */

<template>
  <div class="item-agendamento border border-gray-300 bg-white min-h-[400px] flex flex-col">
    <!-- Lista de slots de agendamento -->
    <div class="flex-1 p-2 overflow-y-auto relative" style="min-height: 896px;">
      <Slot
        v-for="(slot, index) in slotsDoDia"
        :key="index"
        :start="slot.start"
        :end="slot.end"
        :title="slot.title"
        :description="slot.description"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar componente Slot
import Slot from './Slot.vue'

const props = defineProps<{
  data: Date
}>()

// Dados mocados de agendamentos
// TODO: Substituir por dados do banco de dados quando implementar a API de agendamentos
const slotsMocados = [
  {
    start: new Date(2025, 8, 28, 11, 0), // 28/09 11:00
    end: new Date(2025, 8, 28, 12, 0),
    title: 'Consulta Médica',
    description: 'Consulta de rotina com Dr. Silva'
  },
  {
    start: new Date(2025, 8, 29, 13, 30), // 29/09 13:30
    end: new Date(2025, 8, 29, 14, 0),
    title: 'Reunião de Projeto',
    description: 'Discussão sobre novos recursos'
  },
  {
    start: new Date(2025, 8, 30, 11, 15), // 30/09 11:15
    end: new Date(2025, 8, 30, 12, 15),
    title: 'Treinamento',
    description: 'Sessão de treinamento em equipe'
  },
  {
    start: new Date(2025, 9, 1, 14, 0), // 01/10 14:00
    end: new Date(2025, 9, 1, 14, 30),
    title: 'Ligação Importante',
    description: 'Chamada com cliente potencial'
  },
  {
    start: new Date(2025, 9, 2, 12, 0), // 02/10 12:00
    end: new Date(2025, 9, 2, 13, 0),
    title: 'Almoço de Negócios',
    description: 'Encontro com parceiro comercial'
  },
  {
    start: new Date(2025, 9, 3, 11, 30), // 03/10 11:30
    end: new Date(2025, 9, 3, 12, 30),
    title: 'Apresentação',
    description: 'Demonstração do produto'
  },
  {
    start: new Date(2025, 9, 4, 13, 0), // 04/10 13:00
    end: new Date(2025, 9, 4, 14, 0),
    title: 'Revisão de Código',
    description: 'Análise de pull requests'
  }
]

// Computed para filtrar slots do dia
const slotsDoDia = computed(() => {
  return slotsMocados.filter(slot => {
    return slot.start.toDateString() === props.data.toDateString()
  })
})
</script>
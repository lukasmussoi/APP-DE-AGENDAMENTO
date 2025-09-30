/**
 * PROPÓSITO: Componente para exibir item de agendamento para um dia específico
 * IMPORTA: Slot
 * USADO_POR: AgendamentoManager
 */

<template>
  <div class="item-agendamento border border-slate-200 bg-white min-h-[400px] flex flex-col rounded-lg shadow-sm hover:shadow-md transition-all duration-300 card-hover-effect">
    <!-- Lista de slots de agendamento com design moderno -->
    <div class="flex-1 p-3 overflow-y-auto overflow-x-visible relative" style="min-height: 896px;">
      <Slot
        v-for="(slot, index) in slotsComStatus"
        :key="index"
        :start="slot.start"
        :end="slot.end"
        :title="slot.title"
        :description="slot.description"
        :status="slot.status"
        :class="getStatusClass(slot.status)"
        class="mb-2 last:mb-0 transition-all duration-300"
      />
      
      <!-- Estado vazio com design amigável -->
      <div v-if="slotsComStatus.length === 0" class="flex flex-col items-center justify-center h-32 text-slate-400">
        <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="text-sm font-medium">Nenhum agendamento</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar componente Slot
import Slot from './Slot.vue'

const props = defineProps<{
  data: Date
}>()

// Dados mocados de agendamentos com status
// TODO: Substituir por dados do banco de dados quando implementar a API de agendamentos
const slotsMocados = [
  {
    start: new Date(2025, 8, 28, 11, 0), // 28/09 11:00
    end: new Date(2025, 8, 28, 12, 0),
    title: 'Consulta Médica',
    description: 'Consulta de rotina com Dr. Silva',
    status: 'confirmado' as const
  },
  {
    start: new Date(2025, 8, 29, 13, 30), // 29/09 13:30
    end: new Date(2025, 8, 29, 14, 0),
    title: 'Reunião de Projeto',
    description: 'Discussão sobre novos recursos',
    status: 'pendente' as const
  },
  {
    start: new Date(2025, 8, 30, 11, 15), // 30/09 11:15
    end: new Date(2025, 8, 30, 12, 15),
    title: 'Treinamento',
    description: 'Sessão de treinamento em equipe',
    status: 'confirmado' as const
  },
  {
    start: new Date(2025, 9, 1, 14, 0), // 01/10 14:00
    end: new Date(2025, 9, 1, 14, 30),
    title: 'Ligação Importante',
    description: 'Chamada com cliente potencial',
    status: 'ocupado' as const
  },
  {
    start: new Date(2025, 9, 2, 12, 0), // 02/10 12:00
    end: new Date(2025, 9, 2, 13, 0),
    title: 'Almoço de Negócios',
    description: 'Encontro com parceiro comercial',
    status: 'confirmado' as const
  },
  {
    start: new Date(2025, 9, 3, 11, 30), // 03/10 11:30
    end: new Date(2025, 9, 3, 12, 30),
    title: 'Apresentação',
    description: 'Demonstração do produto',
    status: 'pendente' as const
  },
  {
    start: new Date(2025, 9, 4, 13, 0), // 04/10 13:00
    end: new Date(2025, 9, 4, 14, 0),
    title: 'Revisão de Código',
    description: 'Análise de pull requests',
    status: 'disponivel' as const
  }
]

// Computed para filtrar slots do dia com status
const slotsComStatus = computed(() => {
  return slotsMocados.filter(slot => {
    return slot.start.toDateString() === props.data.toDateString()
  })
})

// Função para aplicar classes baseadas no status
const getStatusClass = (status: string) => {
  const statusClasses = {
    'disponivel': 'status-disponivel',
    'ocupado': 'status-ocupado',
    'pendente': 'status-pendente',
    'confirmado': 'status-confirmado'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-50'
}
</script>
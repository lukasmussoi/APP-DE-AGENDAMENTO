/**
 * PROPÓSITO: Componente para exibir item de agendamento para um dia específico
 * IMPORTA: Slot, tipos de Agendamento
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
        :cor="slot.cor"
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

// Importar tipos
import type { Agendamento } from '../types/agendamentos.types'

const props = defineProps<{
  data: Date
  agendamentos: Agendamento[]
}>()

// Computed para converter agendamentos do banco para formato do Slot
const slotsComStatus = computed(() => {
  return props.agendamentos
    .filter(agendamento => {
      // Filtrar apenas agendamentos da data específica
      if (!agendamento.data) return false
      
      // Função auxiliar para comparar datas ignorando timezone
      const compararDatas = (dataString: string, dataObj: Date): boolean => {
        const [ano, mes, dia] = dataString.split('-').map(Number)
        return ano === dataObj.getFullYear() && 
               mes === (dataObj.getMonth() + 1) && 
               dia === dataObj.getDate()
      }
      
      return compararDatas(agendamento.data, props.data)
    })
    .map(agendamento => {
      // Criar data base local (evitando problemas de timezone)
      const partesData = agendamento.data!.split('-')
      const ano = parseInt(partesData[0] || '2025')
      const mes = parseInt(partesData[1] || '1') - 1 // mes - 1 porque Date usa 0-based
      const dia = parseInt(partesData[2] || '1')
      const dataBase = new Date(ano, mes, dia)
      
      // Valores padrão para horas
      let horaInicio = '00', minutoInicio = '00'
      let horaFim = '00', minutoFim = '00'
      
      if (agendamento.hora_inicio) {
        const partes = agendamento.hora_inicio.split(':')
        horaInicio = partes[0] || '00'
        minutoInicio = partes[1] || '00'
      }
      
      if (agendamento.hora_fim) {
        const partes = agendamento.hora_fim.split(':')
        horaFim = partes[0] || '00'
        minutoFim = partes[1] || '00'
      }
      
      // Combinar data com hora_inicio
      const start = new Date(ano, mes, dia, parseInt(horaInicio), parseInt(minutoInicio), 0, 0)
      
      // Combinar data com hora_fim
      const end = new Date(ano, mes, dia, parseInt(horaFim), parseInt(minutoFim), 0, 0)
      
      return {
        start,
        end,
        title: agendamento.titulo || 'Sem título',
        description: agendamento.descricao || '',
        cor: agendamento.cor || '#deebfe',
        status: 'confirmado' as const // Por enquanto, todos confirmados
      }
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
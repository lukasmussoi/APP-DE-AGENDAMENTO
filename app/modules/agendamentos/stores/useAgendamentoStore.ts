/**
 * PROPÓSITO: Store para gerenciamento de estado de agendamentos
 * IMPORTA: defineStore do Pinia
 * USADO_POR: Componentes do módulo de agendamentos
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAgendamentoStore = defineStore('agendamento', () => {
  // Estado
  const dataReferencia = ref(new Date())

  // Computed para dias da semana (domingo a sábado baseado na dataReferencia)
  const diasSemana = computed(() => {
    const data = new Date(dataReferencia.value)
    const diaSemana = data.getDay() // 0 = domingo, 1 = segunda, etc.

    // Encontrar o domingo da semana atual
    const domingo = new Date(data)
    domingo.setDate(data.getDate() - diaSemana)

    // Gerar array de 7 dias (domingo a sábado)
    const dias = []
    for (let i = 0; i < 7; i++) {
      const dia = new Date(domingo)
      dia.setDate(domingo.getDate() + i)
      dias.push(dia)
    }

    return dias
  })

  // Ações
  const avancarSemana = () => {
    const novaData = new Date(dataReferencia.value)
    novaData.setDate(novaData.getDate() + 7)
    dataReferencia.value = novaData
  }

  const voltarSemana = () => {
    const novaData = new Date(dataReferencia.value)
    novaData.setDate(novaData.getDate() - 7)
    dataReferencia.value = novaData
  }

  return {
    // Estado
    dataReferencia,
    diasSemana,

    // Ações
    avancarSemana,
    voltarSemana
  }
})
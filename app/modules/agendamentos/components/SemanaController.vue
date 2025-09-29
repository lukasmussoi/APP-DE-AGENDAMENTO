/**
 * PROPÓSITO: Componente controlador para navegação entre semanas
 * IMPORTA: useAgendamentoStore
 * USADO_POR: AgendamentoManager
 */

<template>
  <div class="inline-block">
    <table class="border-collapse">
      <tbody>
        <!-- Linha da data -->
        <tr>
          <td class="px-4 py-2 text-center">
            <div class="text-xl font-semibold text-gray-800 tracking-wide">
              {{ periodoSemana }}
            </div>
          </td>
        </tr>
        <!-- Linha dos botões -->
        <tr>
          <td class="px-4 py-2 text-center">
            <div class="flex items-center justify-center gap-1">
              <!-- Botão voltar semana -->
              <button
                @click="voltarSemana"
                class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                title="Semana anterior"
              >
                <svg class="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <!-- Botão hoje -->
              <button
                @click="irParaHoje"
                class="flex items-center justify-center px-3 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm font-medium"
                title="Ir para hoje"
              >
                Hoje
              </button>

              <!-- Botão avançar semana -->
              <button
                @click="avancarSemana"
                class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                title="Próxima semana"
              >
                <svg class="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
// Importar store de agendamentos
import { useAgendamentoStore } from '../stores/useAgendamentoStore'

// Usar o store
const agendamentoStore = useAgendamentoStore()

// Computed para o período da semana formatado
const periodoSemana = computed(() => {
  if (agendamentoStore.diasSemana.length < 7) return 'Carregando...'

  const primeiroDia = agendamentoStore.diasSemana[0] // Domingo
  const ultimoDia = agendamentoStore.diasSemana[6]   // Sábado

  if (!primeiroDia || !ultimoDia) return 'Carregando...'

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  return `de ${formatarData(primeiroDia)} até ${formatarData(ultimoDia)}`
})

// Função para ir para a semana atual (hoje)
const irParaHoje = () => {
  agendamentoStore.dataReferencia = new Date()
}

// Funções de navegação
const voltarSemana = () => {
  agendamentoStore.voltarSemana()
}

const avancarSemana = () => {
  agendamentoStore.avancarSemana()
}
</script>
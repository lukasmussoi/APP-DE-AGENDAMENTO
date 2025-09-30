/**
 * PROPÓSITO: Componente principal para gerenciamento de agendamentos
 * IMPORTA: SemanaController, Button
 * USADO_POR: Página de agendamentos
 */

<template>
  <div class="w-full min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header - parte superior modernizado -->
    <div class="topo bg-white shadow-md border-b border-slate-200 flex items-center px-8 py-4 fade-in-up">
      <!-- Controlador de semana no lado esquerdo -->
      <div class="w-1/3">
        <SemanaController />
      </div>

      <!-- Centro: Nome e especialidade do usuário com design moderno -->
      <div class="w-1/3 flex justify-center">
        <div v-if="userEspecialidade" class="text-center bg-slate-50 px-6 py-3 rounded-xl shadow-sm border border-slate-200">
          <p class="font-bold text-slate-800 text-lg">{{ userEspecialidade.nome }}</p>
          <p class="text-sm text-slate-600 font-medium">{{ userEspecialidade.especialidade }}</p>
        </div>
        <div v-else-if="loadingUserEspecialidade" class="text-center bg-slate-50 px-6 py-3 rounded-xl animate-pulse">
          <p class="text-sm text-slate-500">Carregando...</p>
        </div>
        <div v-else class="text-center bg-slate-50 px-6 py-3 rounded-xl border border-slate-200">
          <p class="text-sm text-slate-500">Dados não disponíveis</p>
        </div>
      </div>

      <!-- Espaço para outros controles no lado direito -->
      <div class="w-1/3 flex justify-end">
        <!-- Botão para incluir novos agendamentos modernizado -->
        <button 
          @click="incluirNovoAgendamento"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Novo Agendamento
        </button>
      </div>
    </div>

    <!-- Componente para exibir dias da semana com spacing moderno -->
    <div class="py-4 bg-white border-b border-slate-200">
      <div class="pl-20 pr-8">
        <SemanaDias :dias="agendamentoStore.diasSemana" />
      </div>
    </div>

    <!-- Corpo - parte inferior que ocupa o restante com design moderno -->
    <div class="corpo flex-1 flex bg-white">
      <!-- Régua de horários à esquerda -->
      <ReguaHorarios />

      <!-- Área principal de agendamentos com shadow interno -->
      <div class="flex-1 relative pr-8 bg-slate-50 rounded-tl-xl shadow-inner overflow-visible">
        <!-- Grade de dias da semana com spacing aprimorado -->
        <div class="grid grid-cols-7 h-full gap-1 p-4 overflow-visible">
          <ItemAgendamento
            v-for="(dia, index) in agendamentoStore.diasSemana"
            :key="index"
            :data="dia"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-visible"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar componente controlador de semana
import SemanaController from './SemanaController.vue'

// Importar componente Button
import Button from '../../../shared/components/ui/Button.vue'

// Importar componente SemanaDias
import SemanaDias from './SemanaDias.vue'

// Importar componente ReguaHorarios
import ReguaHorarios from './ReguaHorarios.vue'

// Importar componente ItemAgendamento
import ItemAgendamento from './ItemAgendamento.vue'

// Importar store de agendamentos
import { useAgendamentoStore } from '../stores/useAgendamentoStore'

// Importar composable para dados do usuário
import { profissionalAtual } from '../composables/profissionalAtual'

// Usar o composable
const { userEspecialidade, loading: loadingUserEspecialidade, fetchUserEspecialidade } = profissionalAtual()

// Usar o store de agendamentos
const agendamentoStore = useAgendamentoStore()

// Buscar dados do usuário ao montar o componente
onMounted(async () => {
  await fetchUserEspecialidade()
})

// Função para incluir novo agendamento (implementação futura)
const incluirNovoAgendamento = () => {
  // TODO: Implementar modal ou navegação para criação de agendamento
  console.log('Incluir novo agendamento')
}
</script>
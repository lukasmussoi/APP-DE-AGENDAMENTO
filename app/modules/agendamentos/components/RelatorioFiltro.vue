/**
 * PROPÓSITO: Componente para coletar filtros de relatórios de agendamentos
 * IMPORTA: useRelatorioAgendamentosStore
 * USADO_POR: RelatorioContainer
 */

<template>
  <div class="bg-white border-b border-gray-200 p-4">
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <!-- Cliente -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
        <select
          v-model="filtros.clienteId"
          @change="emitirFiltros"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="!store.dataLoaded"
        >
          <option value="" disabled v-if="!store.dataLoaded">Carregando clientes...</option>
          <option value="">Todos os clientes</option>
          <option
            v-for="cliente in store.clientesAtivos"
            :key="cliente.id"
            :value="cliente.id"
          >
            {{ cliente.nome }}
          </option>
        </select>
      </div>

      <!-- Especialidade -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Especialidade</label>
        <select
          v-model="filtros.especialidadeId"
          @change="emitirFiltros"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="!store.dataLoaded"
        >
          <option value="" disabled v-if="!store.dataLoaded">Carregando especialidades...</option>
          <option value="">Todas as especialidades</option>
          <option
            v-for="especialidade in store.especialidadesUnicas"
            :key="especialidade.id"
            :value="especialidade.id"
          >
            {{ especialidade.nome }}
          </option>
        </select>
      </div>

      <!-- Profissional -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Profissional</label>
        <select
          v-model="filtros.profissionalId"
          @change="emitirFiltros"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :disabled="!store.dataLoaded"
        >
          <option value="" disabled v-if="!store.dataLoaded">Carregando profissionais...</option>
          <option value="">Todos os profissionais</option>
          <option
            v-for="profissional in store.profissionaisFiltrados"
            :key="profissional.id"
            :value="profissional.id"
          >
            {{ profissional.nome }}
          </option>
        </select>
      </div>

      <!-- Data Início -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
        <input
          v-model="filtros.dataInicio"
          @change="emitirFiltros"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Data Fim -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
        <input
          v-model="filtros.dataFim"
          @change="emitirFiltros"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <!-- Botões de ação -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-500">
        <span v-if="store.dataLoaded">
          {{ store.clientesAtivos?.length || 0 }} clientes •
          {{ store.profissionaisAtivos?.length || 0 }} profissionais •
          {{ store.agendamentosFiltrados?.length || 0 }} agendamentos
        </span>
        <span v-else class="flex items-center">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          Carregando dados...
        </span>
      </div>

      <div class="flex gap-2">
        <button
          @click="limparFiltros"
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Limpar Filtros
        </button>

        <button
          @click="aplicarFiltros"
          type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar store do Pinia
import { useRelatorioAgendamentosStore } from '../stores/useRelatorioAgendamentosStore'

// Usar o store diretamente
const store = useRelatorioAgendamentosStore()

// Estados locais
const filtros = ref({
  clienteId: '',
  especialidadeId: '',
  profissionalId: '',
  dataInicio: '',
  dataFim: ''
})

// Métodos
const emitirFiltros = () => {
  console.log('🔍 RelatorioFiltro - Emitindo filtros:', filtros.value)
  store.aplicarFiltros(filtros.value)
}

const limparFiltros = () => {
  filtros.value = {
    clienteId: '',
    especialidadeId: '',
    profissionalId: '',
    dataInicio: '',
    dataFim: ''
  }
  store.limparFiltros()
}

const aplicarFiltros = () => {
  emitirFiltros()
}

// Watch para limpar profissional quando especialidade mudar
watch(() => filtros.value.especialidadeId, (novaEspecialidade) => {
  if (!novaEspecialidade) {
    // Se especialidade foi limpa, limpar também o profissional
    filtros.value.profissionalId = ''
  } else {
    // Se especialidade foi selecionada, verificar se o profissional atual ainda é válido
    const profissionalAtualValido = store.profissionaisFiltrados.some(
      (prof: any) => prof.id === parseInt(filtros.value.profissionalId)
    )
    if (!profissionalAtualValido) {
      filtros.value.profissionalId = ''
    }
  }
})
</script>
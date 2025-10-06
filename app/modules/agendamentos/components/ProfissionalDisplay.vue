/**
 * PROPÓSITO: Componente para exibir e selecionar nome e especialidade do profissional
 * IMPORTA: profissionalAtual, useProfissionais
 * USADO_POR: AgendamentoManager
 */

<template>
  <!-- Display do profissional selecionado -->
  <div @click="abrirModal" class="cursor-pointer text-center bg-slate-50 px-6 py-3 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors">
    <div v-if="agendamentoStore.profissionalSelecionado" class="text-center">
      <p class="font-bold text-slate-800 text-lg">{{ agendamentoStore.profissionalSelecionado.nome }}</p>
      <p class="text-sm text-slate-600 font-medium">{{ agendamentoStore.profissionalSelecionado.especialidade }}</p>
    </div>
    <div v-else-if="loadingUserEspecialidade" class="text-center animate-pulse">
      <p class="text-sm text-slate-500">Carregando...</p>
    </div>
    <div v-else class="text-center">
      <p class="text-sm text-slate-500">Dados não disponíveis</p>
    </div>
  </div>

  <!-- Modal de seleção de profissional -->
  <div v-if="modalAberta" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Selecionar Profissional</h3>
        <div class="space-y-2">
          <div
            v-for="prof in profissionaisComEspecialidade"
            :key="prof.id"
            @click="selecionarProfissional(prof)"
            class="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <p class="font-medium text-slate-800">{{ prof.nome }}</p>
            <p class="text-sm text-slate-600">{{ prof.especialidade }}</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button @click="fecharModal" class="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar composable para dados do usuário
import { profissionalAtual } from '../composables/profissionalAtual'

// Importar composable para profissionais
import { useProfissionais } from '../../profissionais/composables/profissionais'

// Importar store de agendamentos
import { useAgendamentoStore } from '../stores/useAgendamentoStore'

// Importar tipos
import type { Profissional } from '../../profissionais/types/especialidade.types'

// Usar o composable profissionalAtual
const { userEspecialidade, loading: loadingUserEspecialidade, fetchUserEspecialidade } = profissionalAtual()

// Usar o store de agendamentos
const agendamentoStore = useAgendamentoStore()

// Usar o composable useProfissionais para carregar lista de profissionais e especialidades
const { profissionais, especialidades, fetchProfissionais, fetchEspecialidades } = useProfissionais()

// Estado do componente
const modalAberta = ref(false)

// Computed para combinar profissionais com especialidades
const profissionaisComEspecialidade = computed(() => {
  return profissionais.value.map(prof => {
    const especialidade = especialidades.value.find(esp => esp.id === prof.especialidade_id)
    return {
      id: prof.id,
      nome: prof.nome,
      especialidade: especialidade ? especialidade.especialidade : 'Especialidade não encontrada'
    }
  })
})

// Funções
const abrirModal = () => {
  modalAberta.value = true
}

const fecharModal = () => {
  modalAberta.value = false
}

const selecionarProfissional = (prof: { id: number | null; nome: string; especialidade: string }) => {
  agendamentoStore.setProfissionalSelecionado(prof)
  fecharModal()
}

// Carregar dados ao montar o componente
onMounted(async () => {
  await fetchUserEspecialidade()
  await fetchProfissionais()
  await fetchEspecialidades()
  
  // Inicializar com o profissional atual se ainda não definido
  if (!agendamentoStore.profissionalSelecionado) {
    agendamentoStore.setProfissionalSelecionado(userEspecialidade.value)
  }
})
</script>
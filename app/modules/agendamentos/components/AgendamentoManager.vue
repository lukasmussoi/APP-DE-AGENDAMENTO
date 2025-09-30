/**
 * PROPÓSITO: Componente principal para gerenciamento de agendamentos
 * IMPORTA: SemanaController, Button
 * USADO_POR: Página de agendamentos
 */

<template>
  <div class="w-full min-h-screen flex flex-col">
    <!-- Header - parte superior -->
    <div class="topo h-24 bg-gray-50 border-b border-gray-200 flex items-center px-6">
      <!-- Controlador de semana no lado esquerdo -->
      <div class="w-1/3">
        <SemanaController />
      </div>

      <!-- Centro: Nome e especialidade do usuário -->
      <div class="w-1/3 flex justify-center">
        <div v-if="userEspecialidade" class="text-center">
          <p class="font-semibold">{{ userEspecialidade.nome }}</p>
          <p class="text-sm text-gray-600">{{ userEspecialidade.especialidade }}</p>
        </div>
        <div v-else-if="loadingUserEspecialidade" class="text-center">
          <p class="text-sm text-gray-500">Carregando...</p>
        </div>
        <div v-else class="text-center">
          <p class="text-sm text-gray-500">Dados não disponíveis</p>
        </div>
      </div>

      <!-- Espaço para outros controles no lado direito -->
      <div class="w-1/3 flex justify-end">
        <!-- Botão para incluir novos agendamentos -->
        <Button @click="incluirNovoAgendamento">
          Novo Agendamento
        </Button>
      </div>
    </div>

    <!-- Corpo - parte inferior que ocupa o restante -->
    <div class="corpo flex-1">
      <!-- Corpo do gerenciador de agendamentos -->
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar componente controlador de semana
import SemanaController from './SemanaController.vue'

// Importar componente Button
import Button from '../../../shared/components/ui/Button.vue'

// Importar composable para dados do usuário
import { profissionalAtual } from '../composables/profissionalAtual'

// Usar o composable
const { userEspecialidade, loading: loadingUserEspecialidade, fetchUserEspecialidade } = profissionalAtual()

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
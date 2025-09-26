/**
 * PROPÓSITO: Página de profissionais
 * IMPORTA: Composable useProfissionais, useUsuarios, componentes UI
 * USADO_POR: Rota /profissionais
 */

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold">Profissionais</h1>
        <p class="text-neutral-600 mt-1">Gerencie os profissionais do sistema</p>
      </div>
      
      <!-- Botão Novo Profissional (apenas para admin) -->
      <ClientOnly>
        <Button 
          v-if="profileStore.currentProfile?.role === 'admin'" 
          @click="openNovoProfissionalModal"
        >
          Novo Profissional
        </Button>
      </ClientOnly>
    </div>

    <TabelaProfissionais
      :profissionais="profissionais"
      :loading="loading"
      :error="error"
      @retry="fetchProfissionais"
    />
  </div>

  <!-- Modal para adicionar profissional -->
  <ClientOnly>
    <Modal
      v-model="showNovoProfissionalModal"
      title="Novo Profissional"
      confirm-text="Salvar"
      cancel-text="Cancelar"
      :loading="saving"
      @confirm="handleSaveProfissional"
      @cancel="handleCancelProfissional"
    >
      <div class="space-y-4">
        <!-- Dropdown para selecionar perfil -->
        <div>
          <label for="perfil" class="block text-sm font-medium text-neutral-700 mb-2">
            Selecione o Usuário
          </label>
          <select
            id="perfil"
            v-model="selectedPerfilId"
            class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione um usuário...</option>
            <option 
              v-for="perfil in perfis" 
              :key="perfil.id" 
              :value="perfil.id"
            >
              {{ perfil.nome }} ({{ perfil.role }})
            </option>
          </select>
        </div>

        <!-- Dropdown para selecionar especialidade -->
        <div>
          <label for="especialidade" class="block text-sm font-medium text-neutral-700 mb-2">
            Selecione a Especialidade
          </label>
          <select
            id="especialidade"
            v-model="selectedEspecialidadeId"
            class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione uma especialidade...</option>
            <option 
              v-for="especialidade in especialidadesDisponiveis" 
              :key="especialidade.id" 
              :value="especialidade.id"
            >
              {{ especialidade.especialidade }}
            </option>
          </select>
        </div>

        <p v-if="modalError" class="mt-1 text-sm text-red-600">
          {{ modalError }}
        </p>
      </div>
    </Modal>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useProfissionais } from '../modules/profissionais/composables/profissionais'
import { useUsuarios } from '../modules/usuarios/composables/usuarios'
import { useProfileStore } from '../shared/stores/useProfileStore'
import TabelaProfissionais from '../modules/profissionais/components/TabelaProfissionais.vue'
import Modal from '../shared/components/ui/Modal.vue'
import Button from '../shared/components/ui/Button.vue'

// Composables
const { profissionais, loading, error, fetchProfissionais } = useProfissionais()
const { perfis, profissionaisCadastrados, especialidadesDisponiveis, fetchDadosAdmin } = useUsuarios()

// Store de perfil
const profileStore = useProfileStore()

// Estado do modal
const showNovoProfissionalModal = ref(false)
const selectedPerfilId = ref<number | null>(null)
const selectedEspecialidadeId = ref<number | null>(null)
const saving = ref(false)
const modalError = ref<string | null>(null)

// Buscar dados ao montar a página
onMounted(async () => {
  await Promise.all([
    fetchProfissionais(),
    fetchDadosAdmin()
  ])
})

// Handlers do modal
const openNovoProfissionalModal = () => {
  selectedPerfilId.value = null
  selectedEspecialidadeId.value = null
  modalError.value = null
  showNovoProfissionalModal.value = true
}

const handleSaveProfissional = async () => {
  // Validação
  if (!selectedPerfilId.value) {
    modalError.value = 'Selecione um usuário'
    return
  }
  
  if (!selectedEspecialidadeId.value) {
    modalError.value = 'Selecione uma especialidade'
    return
  }

  try {
    saving.value = true
    modalError.value = null

    // TODO: Implementar salvamento no banco
    console.log('Salvando profissional:', {
      perfilId: selectedPerfilId.value,
      especialidadeId: selectedEspecialidadeId.value
    })

    // Fechar modal após salvar
    showNovoProfissionalModal.value = false
  } catch (err: any) {
    modalError.value = err.message || 'Erro ao salvar profissional'
  } finally {
    saving.value = false
  }
}

const handleCancelProfissional = () => {
  showNovoProfissionalModal.value = false
  selectedPerfilId.value = null
  selectedEspecialidadeId.value = null
  modalError.value = null
}
</script>
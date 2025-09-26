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
      @edit="handleEditProfissional"
      @delete="handleDeleteProfissional"
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

  <!-- Modal para editar profissional -->
  <ClientOnly>
    <Modal
      v-model="showEditProfissionalModal"
      title="Editar Profissional"
      confirm-text="Salvar"
      cancel-text="Cancelar"
      :loading="saving"
      @confirm="handleSaveEditProfissional"
      @cancel="handleCancelEditProfissional"
    >
      <div class="space-y-4">
        <!-- Dropdown para selecionar perfil -->
        <div>
          <label for="edit-perfil" class="block text-sm font-medium text-neutral-700 mb-2">
            Selecione o Usuário
          </label>
          <select
            id="edit-perfil"
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
          <label for="edit-especialidade" class="block text-sm font-medium text-neutral-700 mb-2">
            Selecione a Especialidade
          </label>
          <select
            id="edit-especialidade"
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

  <!-- Modal de confirmação de exclusão -->
  <ClientOnly>
    <Modal
      :model-value="showDeleteModal"
      title="Confirmar Exclusão"
      confirm-text="Excluir"
      cancel-text="Cancelar"
      variant="danger"
      :loading="isDeleting"
      @confirm="handleConfirmDelete"
      @update:model-value="showDeleteModal = $event"
    >
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-gray-900">
              Tem certeza que deseja excluir este profissional?
            </h3>
            <p v-if="profissionalToDelete" class="mt-1 text-sm text-gray-600">
              O profissional "<strong>{{ profissionalToDelete.nome }}</strong>" será removido permanentemente.
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useProfissionais } from '../modules/profissionais/composables/profissionais'
import { useUsuarios } from '../modules/usuarios/composables/usuarios'
import { useProfileStore } from '../shared/stores/useProfileStore'
import type { Profissional } from '../modules/profissionais/types/especialidade.types'
import TabelaProfissionais from '../modules/profissionais/components/TabelaProfissionais.vue'
import Modal from '../shared/components/ui/Modal.vue'
import Button from '../shared/components/ui/Button.vue'

// Composables
const { profissionais, loading, error, fetchProfissionais, insertProfissional, updateProfissional, deleteProfissional } = useProfissionais()
const { perfis, profissionaisCadastrados, especialidadesDisponiveis, fetchDadosAdmin } = useUsuarios()

// Store de perfil
const profileStore = useProfileStore()

// Estado do modal
const showNovoProfissionalModal = ref(false)
const selectedPerfilId = ref<number | null>(null)
const selectedEspecialidadeId = ref<number | null>(null)
const saving = ref(false)
const modalError = ref<string | null>(null)

// Estado do modal de edição
const showEditProfissionalModal = ref(false)
const editingProfissional = ref<Profissional | null>(null)

// Estado do modal de confirmação de exclusão
const showDeleteModal = ref(false)
const profissionalToDelete = ref<Profissional | null>(null)
const isDeleting = ref(false)

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

    await insertProfissional(selectedPerfilId.value, selectedEspecialidadeId.value)

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

const handleEditProfissional = (profissional: Profissional) => {
  editingProfissional.value = profissional
  selectedPerfilId.value = parseInt(profissional.profile_id)
  selectedEspecialidadeId.value = profissional.especialidade_id
  modalError.value = null
  showEditProfissionalModal.value = true
}

const handleDeleteProfissional = (profissional: Profissional) => {
  profissionalToDelete.value = profissional
  showDeleteModal.value = true
}

const handleSaveEditProfissional = async () => {
  // Validação
  if (!selectedPerfilId.value) {
    modalError.value = 'Selecione um usuário'
    return
  }

  if (!selectedEspecialidadeId.value) {
    modalError.value = 'Selecione uma especialidade'
    return
  }

  if (!editingProfissional.value) {
    modalError.value = 'Profissional não encontrado'
    return
  }

  try {
    saving.value = true
    modalError.value = null

    await updateProfissional(editingProfissional.value.id, selectedPerfilId.value, selectedEspecialidadeId.value)

    // Fechar modal após salvar
    showEditProfissionalModal.value = false
    editingProfissional.value = null
  } catch (err: any) {
    modalError.value = err.message || 'Erro ao editar profissional'
  } finally {
    saving.value = false
  }
}

const handleCancelEditProfissional = () => {
  showEditProfissionalModal.value = false
  editingProfissional.value = null
  selectedPerfilId.value = null
  selectedEspecialidadeId.value = null
  modalError.value = null
}

const handleConfirmDelete = async () => {
  if (!profissionalToDelete.value || isDeleting.value) return

  // Armazenar o nome antes de deletar para evitar problemas de referência
  const nomeProfissional = profissionalToDelete.value.nome
  isDeleting.value = true

  try {
    await deleteProfissional(profissionalToDelete.value.id)

    // Exibir toast de sucesso
    const { $toast } = useNuxtApp()
    $toast.success(`Profissional "${nomeProfissional}" excluído com sucesso!`)

    showDeleteModal.value = false
    profissionalToDelete.value = null
  } catch (err: any) {
    console.error('Erro ao deletar profissional:', err)

    // Exibir toast de erro
    const { $toast } = useNuxtApp()
    $toast.error('Erro ao excluir profissional. Tente novamente.')

    // Não limpar o estado em caso de erro para permitir tentar novamente
  } finally {
    isDeleting.value = false
  }
}
</script>
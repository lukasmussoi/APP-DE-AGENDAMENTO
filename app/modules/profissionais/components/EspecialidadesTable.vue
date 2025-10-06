/**
 * PROPÓSITO: Tabela para listar especialidades
 * IMPORTA: Componentes UI reutilizáveis, composable useProfissionais
 * USADO_POR: Página de especialidades
 */

<template>
  <Card>
    <template #header>
      <h2 class="text-lg font-semibold text-neutral-900">Lista de Especialidades</h2>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="text-neutral-500">Carregando especialidades...</div>
    </div>

    <div v-else-if="error" class="py-8 text-center text-red-600">
      <p>Erro ao carregar especialidades: {{ error }}</p>
      <Button @click="fetchEspecialidades" class="mt-4">
        Tentar Novamente
      </Button>
    </div>

    <div v-else-if="especialidades.length === 0" class="py-8 text-center text-neutral-500">
      <p>Nenhuma especialidade encontrada</p>
    </div>

    <div v-else class="overflow-x-auto">
      <Table>
        <TableHeader 
          :columns="columns" 
          :sort-key="sortKey"
          :sort-direction="sortDirection"
          @sort="handleSort"
        />
        <TableBody>
          <TableRow 
            v-for="especialidade in sortedEspecialidades" 
            :key="especialidade.id"
            clickable
            @click="handleRowClick(especialidade)"
          >
            <TableCell class="font-medium text-neutral-900">
              {{ especialidade.id }}
            </TableCell>
            <TableCell>
              {{ especialidade.especialidade }}
            </TableCell>
            <TableCell class="text-right">
              <div class="flex gap-2 justify-end">
                <Button 
                  size="sm" 
                  variant="outline"
                  @click.stop="editEspecialidade(especialidade)"
                >
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="danger"
                  @click.stop="handleDeleteClick(especialidade)"
                >
                  Excluir
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <template #footer>
      <div class="flex justify-between items-center">
        <p class="text-sm text-neutral-500">
          Total: {{ especialidades.length }} especialidade{{ especialidades.length !== 1 ? 's' : '' }}
        </p>
        <ClientOnly>
          <Button v-if="profileStore.currentProfile?.role === 'admin'" @click="addEspecialidade">
            Nova Especialidade
          </Button>
        </ClientOnly>
      </div>
    </template>
  </Card>

  <!-- Modal para adicionar/editar especialidade -->
  <ClientOnly>
    <Modal
      v-model="showAddModal"
      :title="isEdicao ? 'Editar Especialidade' : 'Nova Especialidade'"
      confirm-text="Salvar"
      cancel-text="Cancelar"
      :loading="inserting"
      :is-edicao="isEdicao"
      @confirm="handleSaveEspecialidade"
      @cancel="handleCancelEspecialidade"
    >
      <div class="space-y-4">
        <div>
          <label for="especialidade" class="block text-sm font-medium text-neutral-700 mb-2">
            Nome da Especialidade
          </label>
          <Input
            id="especialidade"
            v-model="novaEspecialidade"
            placeholder="Digite o nome da especialidade"
            @keyup.enter="handleSaveEspecialidade"
          />
          <p v-if="formError" class="mt-1 text-sm text-red-600">
            {{ formError }}
          </p>
        </div>
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
              Tem certeza que deseja excluir esta especialidade?
            </h3>
            <p v-if="especialidadeToDelete" class="mt-1 text-sm text-gray-600">
              A especialidade "<strong>{{ especialidadeToDelete.especialidade }}</strong>" será removida permanentemente.
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Especialidade } from '../types/especialidade.types'
import { useProfissionais } from '../composables/profissionais'
import { useProfileStore } from '../../../shared/stores/useProfileStore'

// Imports explícitos dos componentes UI
import Card from '../../../shared/components/ui/Card.vue'
import Button from '../../../shared/components/ui/Button.vue'
import Table from '../../../shared/components/ui/Table.vue'
import TableHeader from '../../../shared/components/ui/TableHeader.vue'
import TableBody from '../../../shared/components/ui/TableBody.vue'
import TableRow from '../../../shared/components/ui/TableRow.vue'
import TableCell from '../../../shared/components/ui/TableCell.vue'
import Modal from '../../../shared/components/ui/Modal.vue'
import Input from '../../../shared/components/ui/Input.vue'

// Composable
const { especialidades, loading, error, fetchEspecialidades, inserting, insertEspecialidade, updateEspecialidade, deleteEspecialidade } = useProfissionais()

// Store de perfil
const profileStore = useProfileStore()

// Estado da tabela
const sortKey = ref<string>('id')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Estado do modal
const showAddModal = ref(false)

// Estado do modal de confirmação de exclusão
const showDeleteModal = ref(false)
const especialidadeToDelete = ref<Especialidade | null>(null)
const isDeleting = ref(false)

// Estado do formulário
const novaEspecialidade = ref('')
const formError = ref<string | null>(null)
const isEdicao = ref(false)
const especialidadeEditando = ref<Especialidade | null>(null)

// Configuração das colunas
const columns = [
  { key: 'id', label: 'ID', sortable: true, class: 'w-20' },
  { key: 'especialidade', label: 'Especialidade', sortable: true },
  { key: 'actions', label: 'Ações', sortable: false, class: 'w-40 text-right' }
]

// Computed para especialidades ordenadas
const sortedEspecialidades = computed(() => {
  const sorted = [...especialidades.value]
  
  if (sortKey.value) {
    sorted.sort((a, b) => {
      const aValue = a[sortKey.value as keyof Especialidade]
      const bValue = b[sortKey.value as keyof Especialidade]
      
      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1
      
      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  }
  
  return sorted
})

// Handlers
const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const handleRowClick = (especialidade: Especialidade) => {
  console.log('Clicou na especialidade:', especialidade)
}

const editEspecialidade = (especialidade: Especialidade) => {
  isEdicao.value = true
  especialidadeEditando.value = especialidade
  novaEspecialidade.value = especialidade.especialidade
  formError.value = null
  showAddModal.value = true
}

const handleDeleteClick = (especialidade: Especialidade) => {
  especialidadeToDelete.value = especialidade
  showDeleteModal.value = true
}

const addEspecialidade = () => {
  isEdicao.value = false
  especialidadeEditando.value = null
  novaEspecialidade.value = ''
  formError.value = null
  showAddModal.value = true
}

// Handlers do formulário
const handleSaveEspecialidade = async () => {
  if (!novaEspecialidade.value.trim()) {
    formError.value = 'O nome da especialidade é obrigatório'
    return
  }

  try {
    formError.value = null

    if (isEdicao.value && especialidadeEditando.value) {
      // Modo edição
      await updateEspecialidade(especialidadeEditando.value.id, novaEspecialidade.value.trim())
    } else {
      // Modo inserção
      await insertEspecialidade(novaEspecialidade.value.trim())
    }
    
    // Fechar modal e limpar formulário
    showAddModal.value = false
    novaEspecialidade.value = ''
    isEdicao.value = false
    especialidadeEditando.value = null
  } catch (err: any) {
    formError.value = err.message || 'Erro ao salvar especialidade'
  }
}

const handleCancelEspecialidade = () => {
  showAddModal.value = false
  novaEspecialidade.value = ''
  formError.value = null
  isEdicao.value = false
  especialidadeEditando.value = null
}

// Handlers para exclusão
const handleConfirmDelete = async () => {
  if (!especialidadeToDelete.value || isDeleting.value) return

  // Armazenar o nome antes de deletar para evitar problemas de referência
  const nomeEspecialidade = especialidadeToDelete.value.especialidade
  isDeleting.value = true

  try {
    await deleteEspecialidade(especialidadeToDelete.value.id)
    
    // Exibir toast de sucesso
    const { $toast } = useNuxtApp()
    $toast.success(`Especialidade "${nomeEspecialidade}" excluída com sucesso!`)
    
    showDeleteModal.value = false
    especialidadeToDelete.value = null
  } catch (err: any) {
    console.error('Erro ao deletar especialidade:', err)
    
    // Exibir toast de erro
    const { $toast } = useNuxtApp()
    $toast.error('Erro ao excluir especialidade. Tente novamente.')
    
    // Não limpar o estado em caso de erro para permitir tentar novamente
  } finally {
    isDeleting.value = false
  }
}

// Carregar dados ao montar o componente
onMounted(() => {
  fetchEspecialidades()
})
</script>
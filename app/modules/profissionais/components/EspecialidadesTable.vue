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
                  @click.stop="deleteEspecialidade(especialidade)"
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
        <Button v-if="profileStore.currentProfile?.role === 'admin'" @click="addEspecialidade">
          Nova Especialidade
        </Button>
      </div>
    </template>
  </Card>

  <!-- Modal para adicionar nova especialidade -->
  <Modal
    v-model="showAddModal"
    title="Nova Especialidade"
    confirm-text="Salvar"
    cancel-text="Cancelar"
    :loading="inserting"
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
const { especialidades, loading, error, fetchEspecialidades, inserting, insertEspecialidade } = useProfissionais()

// Store de perfil
const profileStore = useProfileStore()

// Estado da tabela
const sortKey = ref<string>('id')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Estado do modal
const showAddModal = ref(false)

// Estado do formulário
const novaEspecialidade = ref('')
const formError = ref<string | null>(null)

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
  console.log('Editar especialidade:', especialidade)
}

const deleteEspecialidade = (especialidade: Especialidade) => {
  console.log('Excluir especialidade:', especialidade)
}

const addEspecialidade = () => {
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
    await insertEspecialidade(novaEspecialidade.value.trim())
    
    // Fechar modal e limpar formulário
    showAddModal.value = false
    novaEspecialidade.value = ''
  } catch (err: any) {
    formError.value = err.message || 'Erro ao salvar especialidade'
  }
}

const handleCancelEspecialidade = () => {
  showAddModal.value = false
  novaEspecialidade.value = ''
  formError.value = null
}

// Carregar dados ao montar o componente
onMounted(() => {
  fetchEspecialidades()
})
</script>
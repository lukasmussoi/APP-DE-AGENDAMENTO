/**
 * PROPÓSITO: Tabela específica para exibição de clientes
 * IMPORTA: Componentes UI de tabela, tipos de Cliente, useClientes
 * USADO_POR: Página clientes.vue
 */

<template>
  <!-- Header com botão de adicionar -->
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-2xl font-bold text-neutral-900">Clientes</h1>
      <p class="text-neutral-600 mt-1">Gerencie os clientes do sistema</p>
    </div>
    <Button @click="handleAddCliente" class="flex items-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      Novo Cliente
    </Button>
  </div>

  <Card>
    <template #header>
      <h2 class="text-lg font-semibold text-neutral-900">Lista de Clientes</h2>
    </template>

    <!-- Estado de loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="text-neutral-500">Carregando clientes...</div>
    </div>

    <!-- Estado de erro -->
    <div v-else-if="error" class="py-8 text-center text-red-600">
      <p>Erro ao carregar clientes: {{ error }}</p>
      <Button @click="listarClientes" class="mt-4">
        Tentar Novamente
      </Button>
    </div>

    <!-- Estado vazio -->
    <div v-else-if="clientes.length === 0" class="py-8 text-center text-neutral-500">
      <p>Nenhum cliente encontrado</p>
    </div>

    <!-- Tabela -->
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
            v-for="cliente in sortedClientes"
            :key="cliente.id"
            clickable
            @click="handleRowClick(cliente)"
          >
            <TableCell>
              {{ cliente.nome || '-' }}
            </TableCell>
            <TableCell class="font-mono text-sm">
              {{ cliente.cpf }}
            </TableCell>
            <TableCell>
              <span class="text-primary-600">{{ cliente.email }}</span>
            </TableCell>
            <TableCell>
              {{ cliente.telefone || '-' }}
            </TableCell>
            <TableCell>
              {{ cliente.endereco || '-' }}
            </TableCell>
            <TableCell class="text-right">
              <div class="flex gap-2 justify-end">
                <Button 
                  size="sm" 
                  variant="outline"
                  @click.stop="handleEditCliente(cliente)"
                >
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="danger"
                  @click.stop="handleDeleteCliente(cliente)"
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
          Total: {{ clientes.length }} cliente{{ clientes.length !== 1 ? 's' : '' }}
        </p>
      </div>
    </template>
  </Card>

  <!-- Modal para adicionar/editar cliente -->
  <ClientOnly>
    <Modal
      v-model="showModal"
      :title="isEditing ? 'Editar Cliente' : 'Novo Cliente'"
      confirm-text="Salvar"
      cancel-text="Cancelar"
      :loading="saving"
      @confirm="handleSaveCliente"
      @cancel="handleCancelCliente"
    >
      <div class="space-y-4">
        <div>
          <label for="nome" class="block text-sm font-medium text-neutral-700 mb-2">
            Nome
          </label>
          <Input
            id="nome"
            v-model="clienteForm.nome"
            placeholder="Digite o nome do cliente"
          />
        </div>
        <div>
          <label for="cpf" class="block text-sm font-medium text-neutral-700 mb-2">
            CPF
          </label>
          <Input
            id="cpf"
            v-model="cpfMasked"
            placeholder="000.000.000-00"
            maxlength="14"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-neutral-700 mb-2">
            Email
          </label>
          <Input
            id="email"
            v-model="clienteForm.email"
            type="email"
            placeholder="fulano@exemplo.com"
          />
        </div>
        <div>
          <label for="telefone" class="block text-sm font-medium text-neutral-700 mb-2">
            Telefone
          </label>
          <Input
            id="telefone"
            v-model="telefoneMasked"
            placeholder="(41) 9 9999-9999"
            maxlength="16"
          />
        </div>
        <div>
          <label for="endereco" class="block text-sm font-medium text-neutral-700 mb-2">
            Endereço
          </label>
          <Input
            id="endereco"
            v-model="clienteForm.endereco"
            placeholder="Digite o endereço"
          />
        </div>
        <p v-if="formError" class="mt-1 text-sm text-red-600">
          {{ formError }}
        </p>
      </div>
    </Modal>
  </ClientOnly>

  <!-- Modal de confirmação de exclusão -->
  <ClientOnly>
    <Modal
      v-model="showDeleteModal"
      title="Confirmar Exclusão"
      confirm-text="Excluir"
      cancel-text="Cancelar"
      variant="danger"
      :loading="deleting"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    >
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-medium text-neutral-900">
              Tem certeza que deseja excluir este cliente?
            </h3>
            <p class="mt-2 text-sm text-neutral-600">
              Esta ação não pode ser desfeita. O cliente <strong>{{ clienteParaExcluir?.nome || clienteParaExcluir?.email }}</strong> será removido permanentemente do sistema.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Cliente } from '../types/clientes.types'
import { useClientes } from '../composables/clientes'

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

const { clientes, listarClientes, insertCliente, updateCliente, deleteCliente, formatCPF, formatPhone, validateCPF, validateEmail, cleanCPF, cleanPhone } = useClientes()
const loading = ref(false)
const error = ref<string | null>(null)

// Estado da tabela
const sortKey = ref<string>('nome')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Estado do modal
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const clienteEditando = ref<Cliente | null>(null)
const clienteForm = ref({
  nome: '',
  cpf: '',
  email: '',
  endereco: '',
  telefone: ''
})
const formError = ref<string | null>(null)
const toastShown = ref(false)

// Valores limpos (sem máscara) para salvar no banco
const cpfClean = ref('')
const telefoneClean = ref('')

// Estado do modal de confirmação de exclusão
const showDeleteModal = ref(false)
const clienteParaExcluir = ref<Cliente | null>(null)
const deleting = ref(false)
const deleteToastShown = ref(false)

// Computed para máscaras
const cpfMasked = computed({
  get: () => formatCPF(cpfClean.value),
  set: (value: string) => {
    cpfClean.value = cleanCPF(value)
  }
})

const telefoneMasked = computed({
  get: () => formatPhone(telefoneClean.value),
  set: (value: string) => {
    telefoneClean.value = cleanPhone(value)
  }
})

// Configuração das colunas
const columns = [
  { key: 'nome', label: 'Nome', sortable: true },
  { key: 'cpf', label: 'CPF', sortable: true, class: 'w-32' },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'telefone', label: 'Telefone', sortable: false },
  { key: 'endereco', label: 'Endereço', sortable: false },
  { key: 'actions', label: 'Ações', sortable: false, class: 'w-40 text-right' }
]

// Computed para clientes ordenados
const sortedClientes = computed(() => {
  const sorted = [...clientes.value]

  if (sortKey.value) {
    sorted.sort((a, b) => {
      const aValue = a[sortKey.value as keyof Cliente]
      const bValue = b[sortKey.value as keyof Cliente]

      const aVal = aValue ?? ''
      const bVal = bValue ?? ''

      let comparison = 0
      if (aVal < bVal) comparison = -1
      if (aVal > bVal) comparison = 1

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

const handleRowClick = (cliente: Cliente) => {
  console.log('Clicou no cliente:', cliente)
}

const handleAddCliente = () => {
  isEditing.value = false
  clienteForm.value = { nome: '', cpf: '', email: '', endereco: '', telefone: '' }
  cpfClean.value = ''
  telefoneClean.value = ''
  formError.value = null
  showModal.value = true
}

const handleEditCliente = (cliente: Cliente) => {
  isEditing.value = true
  clienteEditando.value = cliente
  clienteForm.value = {
    nome: cliente.nome || '',
    cpf: cliente.cpf,
    email: cliente.email,
    endereco: cliente.endereco || '',
    telefone: cliente.telefone || ''
  }
  cpfClean.value = cliente.cpf
  telefoneClean.value = cliente.telefone || ''
  formError.value = null
  showModal.value = true
}

const handleDeleteCliente = (cliente: Cliente) => {
  clienteParaExcluir.value = cliente
  showDeleteModal.value = true
}

const handleConfirmDelete = async () => {
  if (!clienteParaExcluir.value) return

  deleting.value = true
  deleteToastShown.value = false
  try {
    await deleteCliente(clienteParaExcluir.value.id)
    
    // Toast de sucesso
    if (!deleteToastShown.value) {
      const { $toast } = useNuxtApp()
      $toast.success('Cliente excluído com sucesso!')
      deleteToastShown.value = true
    }
    
    showDeleteModal.value = false
    clienteParaExcluir.value = null
  } catch (err: any) {
    const { $toast } = useNuxtApp()
    $toast.error(err.message || 'Erro ao excluir cliente')
  } finally {
    deleting.value = false
  }
}

const handleCancelDelete = () => {
  showDeleteModal.value = false
  clienteParaExcluir.value = null
  deleteToastShown.value = false
}

const handleSaveCliente = async () => {
  // Validações
  if (!clienteForm.value.nome.trim()) {
    formError.value = 'Nome é obrigatório'
    return
  }

  if (!cpfClean.value.trim()) {
    formError.value = 'CPF é obrigatório'
    return
  }

  if (!validateCPF(cpfClean.value)) {
    formError.value = 'CPF inválido'
    return
  }

  if (!clienteForm.value.email.trim()) {
    formError.value = 'Email é obrigatório'
    return
  }

  const emailError = validateEmail(clienteForm.value.email.trim())
  if (emailError) {
    formError.value = emailError
    return
  }

  saving.value = true
  toastShown.value = false
  try {
    formError.value = null

    if (isEditing.value && clienteEditando.value) {
      // Modo edição
      await updateCliente(clienteEditando.value.id, {
        nome: clienteForm.value.nome.trim(),
        cpf: cpfClean.value.trim(),
        email: clienteForm.value.email.trim(),
        endereco: clienteForm.value.endereco.trim() || null,
        telefone: telefoneClean.value.trim() || null
      })

      // Toast de sucesso
      if (!toastShown.value) {
        const { $toast } = useNuxtApp()
        $toast.success('Cliente atualizado com sucesso!')
        toastShown.value = true
      }
    } else {
      // Modo inserção
      await insertCliente({
        nome: clienteForm.value.nome.trim(),
        cpf: cpfClean.value.trim(),
        email: clienteForm.value.email.trim(),
        endereco: clienteForm.value.endereco.trim() || null,
        telefone: telefoneClean.value.trim() || null
      })

      // Toast de sucesso
      if (!toastShown.value) {
        const { $toast } = useNuxtApp()
        $toast.success('Cliente adicionado com sucesso!')
        toastShown.value = true
      }
    }

    showModal.value = false
    clienteForm.value = { nome: '', cpf: '', email: '', endereco: '', telefone: '' }
    cpfClean.value = ''
    telefoneClean.value = ''
    clienteEditando.value = null
    isEditing.value = false
  } catch (err: any) {
    formError.value = err.message || 'Erro ao salvar cliente'
  } finally {
    saving.value = false
  }
}

const handleCancelCliente = () => {
  showModal.value = false
  clienteForm.value = { nome: '', cpf: '', email: '', endereco: '', telefone: '' }
  cpfClean.value = ''
  telefoneClean.value = ''
  formError.value = null
  isEditing.value = false
  clienteEditando.value = null
  toastShown.value = false
}

function formatDate(value: string): string {
  if (!value) return '-'
  try {
    return new Date(value).toLocaleDateString('pt-BR')
  } catch {
    return value
  }
}

// Carregar dados ao montar o componente
onMounted(async () => {
  loading.value = true
  try {
    await listarClientes()
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar clientes'
  } finally {
    loading.value = false
  }
})
</script>
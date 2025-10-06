/**
 * PROPÓSITO: Componente de tabela para listar usuários (admin)
 * IMPORTA: Componentes UI reutilizáveis
 * USADO_POR: Página admin
 */

<template>
  <div class="space-y-4">
    <!-- Header da tabela -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Usuários do Sistema</h2>
        <p class="text-sm text-gray-600">Lista de todos os usuários cadastrados</p>
      </div>
      
      <!-- Botão Novo Usuário -->
      <Button 
        @click="openNovoUsuarioModal"
        :disabled="loading"
      >
        + Novo Usuário
      </Button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Carregando usuários...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <ExclamationCircleIcon class="w-5 h-5 text-red-400 mr-3 mt-0.5" />
        <div>
          <h3 class="text-sm font-medium text-red-800">Erro ao carregar usuários</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          <Button 
            variant="outline" 
            size="sm" 
            class="mt-3"
            @click="$emit('retry')"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>

    <!-- Tabela de usuários -->
    <div v-else-if="usuarios.length > 0" class="bg-white shadow rounded-lg overflow-hidden">
      <Table>
        <TableHeader 
          :columns="tableColumns"
        />
        <TableBody>
          <TableRow 
            v-for="usuario in usuarios" 
            :key="usuario.id"
            class="hover:bg-gray-50"
          >
            <TableCell class="font-mono text-sm text-gray-600">
              {{ usuario.id }}
            </TableCell>
            <TableCell class="font-medium text-gray-900">
              {{ usuario.nome }}
            </TableCell>
            <TableCell>
              <Badge 
                :variant="usuario.role === 'admin' ? 'success' : 'neutral'"
                class="capitalize"
              >
                {{ usuario.role }}
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
      <UsersIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
      <p class="text-gray-600 mb-4">Não há usuários cadastrados no sistema.</p>
      <Button variant="outline" @click="$emit('retry')">
        Recarregar
      </Button>
    </div>
  </div>

  <!-- Modal para adicionar usuário -->
  <ClientOnly>
    <Modal
      v-model="showNovoUsuarioModal"
      title="Novo Usuário"
      confirm-text="Salvar"
      cancel-text="Cancelar"
      :loading="saving"
      @confirm="handleSaveUsuario"
      @cancel="handleCancelUsuario"
    >
      <div class="space-y-4">
        <!-- Nome Completo -->
        <div>
          <label for="nome" class="block text-sm font-medium text-neutral-700 mb-2">
            Nome Completo
          </label>
          <Input
            id="nome"
            v-model="novoUsuario.nome"
            type="text"
            placeholder="Digite o nome completo"
            required
          />
        </div>

        <!-- E-mail -->
        <div>
          <label for="email" class="block text-sm font-medium text-neutral-700 mb-2">
            E-mail
          </label>
          <Input
            id="email"
            v-model="novoUsuario.email"
            type="email"
            placeholder="Digite o e-mail"
            required
          />
        </div>

        <!-- Senha -->
        <div>
          <label for="senha" class="block text-sm font-medium text-neutral-700 mb-2">
            Senha
          </label>
          <Input
            id="senha"
            v-model="novoUsuario.senha"
            type="password"
            placeholder="Digite a senha"
            required
          />
        </div>

        <!-- Confirmar Senha -->
        <div>
          <label for="confirmar-senha" class="block text-sm font-medium text-neutral-700 mb-2">
            Confirmar Senha
          </label>
          <Input
            id="confirmar-senha"
            v-model="novoUsuario.confirmarSenha"
            type="password"
            placeholder="Confirme a senha"
            required
          />
        </div>

        <!-- Tipo de Usuário -->
        <div>
          <label for="role" class="block text-sm font-medium text-neutral-700 mb-2">
            Tipo de Usuário
          </label>
          <select
            id="role"
            v-model="novoUsuario.role"
            class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione o tipo de usuário...</option>
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
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
import type { UsuarioListaAdmin } from '../types/usuarios.types'
import Table from '../../../shared/components/ui/Table.vue'
import TableHeader from '../../../shared/components/ui/TableHeader.vue'
import TableBody from '../../../shared/components/ui/TableBody.vue'
import TableRow from '../../../shared/components/ui/TableRow.vue'
import TableCell from '../../../shared/components/ui/TableCell.vue'
import Button from '../../../shared/components/ui/Button.vue'
import Badge from '../../../shared/components/ui/Badge.vue'
import Modal from '../../../shared/components/ui/Modal.vue'
import Input from '../../../shared/components/ui/Input.vue'
import { ExclamationCircleIcon, UsersIcon } from '@heroicons/vue/24/outline'

interface Props {
  usuarios: readonly UsuarioListaAdmin[]
  loading: boolean
  error: string | null
}

interface Emits {
  retry: []
}

defineProps<Props>()
defineEmits<Emits>()

// Configuração das colunas da tabela
const tableColumns = [
  { key: 'id', label: 'ID', class: 'w-20' },
  { key: 'nome', label: 'Nome' },
  { key: 'role', label: 'Role', class: 'w-32' }
]

// Estado do modal
const showNovoUsuarioModal = ref(false)
const saving = ref(false)
const modalError = ref<string | null>(null)

// Dados do novo usuário
const novoUsuario = ref({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  role: ''
})

// Handlers do modal
const openNovoUsuarioModal = () => {
  // Limpar campos e abrir modal
  novoUsuario.value = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: ''
  }
  modalError.value = null
  showNovoUsuarioModal.value = true
}

const handleSaveUsuario = async () => {
  // TODO: Implementar validação e salvamento
  console.log('Salvar usuário:', novoUsuario.value)
  
  // Validação básica
  if (!novoUsuario.value.nome) {
    modalError.value = 'Nome é obrigatório'
    return
  }
  
  if (!novoUsuario.value.email) {
    modalError.value = 'E-mail é obrigatório'
    return
  }
  
  if (!novoUsuario.value.senha) {
    modalError.value = 'Senha é obrigatória'
    return
  }
  
  if (novoUsuario.value.senha !== novoUsuario.value.confirmarSenha) {
    modalError.value = 'As senhas não coincidem'
    return
  }
  
  if (!novoUsuario.value.role) {
    modalError.value = 'Selecione o tipo de usuário'
    return
  }

  try {
    saving.value = true
    modalError.value = null

    // TODO: Chamar função do composable para criar usuário
    
    // Simular delay para mostrar loading
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Fechar modal após salvar
    showNovoUsuarioModal.value = false
    console.log('Usuário criado com sucesso!')
  } catch (err: any) {
    modalError.value = err.message || 'Erro ao criar usuário'
  } finally {
    saving.value = false
  }
}

const handleCancelUsuario = () => {
  showNovoUsuarioModal.value = false
  modalError.value = null
}
</script>
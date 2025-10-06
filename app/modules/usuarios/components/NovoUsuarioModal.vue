/**
 * PROPÓSITO: Modal para criação de novos usuários
 * IMPORTA: Componentes UI reutilizáveis
 * USADO_POR: TabelaUsuarios.vue
 */

<template>
  <ClientOnly>
    <Modal
      v-model="showModal"
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
import { toast } from 'vue3-toastify'
import Modal from '../../../shared/components/ui/Modal.vue'
import Input from '../../../shared/components/ui/Input.vue'

interface Props {
  modelValue: boolean
}

interface Emits {
  'update:modelValue': [value: boolean]
  'usuario-criado': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Computed para v-model
const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Estado do modal
const saving = ref(false)
const modalError = ref<string | null>(null)
const lastSubmitTime = ref(0)

// Dados do novo usuário
const novoUsuario = ref({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  role: ''
})

// Handlers do modal
const handleSaveUsuario = async () => {
  // Prevenir múltiplas execuções (debounce manual)
  const now = Date.now()
  if (saving.value || (now - lastSubmitTime.value) < 1000) {
    return
  }
  lastSubmitTime.value = now

  // Validação básica (apenas modal error, sem toast para não poluir)
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

    // Chamar API do servidor para criar usuário
    const response = await $fetch('/api/usuarios/criar', {
      method: 'POST',
      body: {
        nome: novoUsuario.value.nome,
        email: novoUsuario.value.email,
        senha: novoUsuario.value.senha,
        role: novoUsuario.value.role
      }
    })

    if (!response.success) {
      throw new Error(response.message || 'Erro ao criar usuário')
    }

    console.log('✅ Usuário criado com sucesso:', response.data)
    
    // Mostrar notificação de sucesso
    const tipoUsuario = novoUsuario.value.role === 'admin' ? 'Administrador' : 'Usuário'
    toast.success(`${tipoUsuario} "${novoUsuario.value.nome}" criado com sucesso!`)
    
    // Limpar campos
    novoUsuario.value = {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      role: ''
    }
    
    // Fechar modal e emitir evento
    showModal.value = false
    emit('usuario-criado')
  } catch (err: any) {
    console.error('❌ Erro ao criar usuário:', err)
    const errorMessage = err.message || err.statusMessage || err.data?.message || 'Erro ao criar usuário'
    modalError.value = errorMessage
    
    // Mostrar notificação de erro (apenas uma)
    toast.error(errorMessage)
    
    // Não fechar o modal em caso de erro
    return
  } finally {
    saving.value = false
  }
}

const handleCancelUsuario = () => {
  showModal.value = false
  modalError.value = null
  
  // Limpar campos ao cancelar
  novoUsuario.value = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: ''
  }
}

// Limpar campos quando o modal abrir
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    modalError.value = null
    novoUsuario.value = {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      role: ''
    }
  }
})
</script>
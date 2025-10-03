/**
 * PROPÓSITO: Formulário para edição de perfil do usuário (nome e senha)
 * IMPORTA: Componentes UI reutilizáveis
 * USADO_POR: Página de perfil
 */

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Campo Nome de Usuário -->
    <div>
      <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">
        Nome de Usuário
      </label>
      <Input
        id="nome"
        v-model="nome"
        placeholder="Digite seu nome"
        required
      />
    </div>

    <!-- Campo E-mail -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
        E-mail
      </label>
      <Input
        id="email"
        type="email"
        v-model="email"
        placeholder="Digite seu e-mail"
        required
      />
    </div>

    <!-- Campo Nova Senha -->
    <div>
      <label for="senha" class="block text-sm font-medium text-gray-700 mb-2">
        Nova Senha
      </label>
      <Input
        id="senha"
        type="password"
        v-model="senha"
        placeholder="Digite a nova senha"
      />
    </div>

    <!-- Campo Confirmar Nova Senha -->
    <div>
      <label for="confirmarSenha" class="block text-sm font-medium text-gray-700 mb-2">
        Confirmar Nova Senha
      </label>
      <Input
        id="confirmarSenha"
        type="password"
        v-model="confirmarSenha"
        placeholder="Confirme a nova senha"
      />
    </div>

    <!-- Botão Salvar -->
    <div class="flex justify-end">
      <Button type="submit" variant="primary" :disabled="isSubmitting">
        <span v-if="isSubmitting">Salvando...</span>
        <span v-else>Salvar Alterações</span>
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

// Importar componentes UI reutilizáveis
import Input from '~/shared/components/ui/Input.vue'
import Button from '~/shared/components/ui/Button.vue'

// Importar composable de usuários
import { useUsuarios } from '../composables/usuarios'

// Usar composable
const { updateUserName, updateUserEmail, updateUserPassword } = useUsuarios()

// Estado reativo para os campos
const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')

// Estado para feedback
const isSubmitting = ref(false)

// Função de submit
const handleSubmit = async () => {
  // Validações básicas
  if (senha.value && senha.value !== confirmarSenha.value) {
    toast.error('As senhas não coincidem')
    return
  }

  if (!nome.value && !email.value && !senha.value) {
    toast.error('Preencha pelo menos um campo para atualizar')
    return
  }

  isSubmitting.value = true

  try {
    // Atualizar nome se preenchido
    if (nome.value) {
      await updateUserName(nome.value)
    }

    // Atualizar email se preenchido
    if (email.value) {
      await updateUserEmail(email.value)
    }

    // Atualizar senha se preenchida
    if (senha.value) {
      await updateUserPassword(senha.value)
    }

    // Sucesso - apenas um toast
    toast.success('Perfil atualizado com sucesso!')

    // Limpar campos de senha
    senha.value = ''
    confirmarSenha.value = ''

  } catch (err) {
    // Erro - apenas um toast
    toast.error('Erro ao atualizar perfil. Tente novamente.')
    console.error('Erro ao atualizar perfil:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>
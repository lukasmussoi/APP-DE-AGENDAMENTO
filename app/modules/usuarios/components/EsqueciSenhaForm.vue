/**
 * PROPÓSITO: Formulário para recuperação de senha
 * IMPORTA: Componentes UI reutilizáveis, useAuth
 * USADO_POR: Página de esqueci senha
 */

<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-6">
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

      <!-- Botão Enviar -->
      <div>
        <Button
          type="submit"
          variant="primary"
          class="w-full"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Enviando...</span>
          <span v-else>Enviar link de recuperação</span>
        </Button>
      </div>

      <!-- Link para voltar ao login -->
      <div class="text-center">
        <NuxtLink
          to="/login"
          class="text-sm text-blue-600 hover:text-blue-500 transition-colors"
        >
          Voltar ao login
        </NuxtLink>
      </div>
    </form>

    <!-- Modal de Confirmação -->
    <Modal
      v-model="showModal"
      title="Link enviado!"
      :show-default-footer="false"
    >
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="text-sm text-gray-500 mb-4">
          Se o e-mail informado estiver cadastrado em nosso sistema, você receberá um link para redefinir sua senha.
        </p>
        <p class="text-xs text-gray-400">
          Verifique sua caixa de entrada e também a pasta de spam.
        </p>
      </div>

      <template #footer>
        <Button
          variant="primary"
          class="w-full"
          @click="closeModal"
        >
          Entendi
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Importar componentes UI reutilizáveis
import Input from '~/shared/components/ui/Input.vue'
import Button from '~/shared/components/ui/Button.vue'
import Modal from '~/shared/components/ui/Modal.vue'

// Importar composable de autenticação
import { useAuth } from '~/shared/composables/useAuth'

// Estado reativo
const email = ref('')
const isSubmitting = ref(false)
const showModal = ref(false)

// Instância do composable useAuth
const { resetPassword } = useAuth()

// Função de submit
const handleSubmit = async () => {
  if (!email.value.trim()) return

  isSubmitting.value = true

  try {
    const result = await resetPassword(email.value.trim())

    if (result.success) {
      showModal.value = true
      email.value = '' // Limpar campo após sucesso
    } else {
      // O erro já é tratado no useAuth e pode ser mostrado via toast
      console.error('Erro ao enviar link de recuperação:', result.error)
    }
  } catch (error) {
    console.error('Erro inesperado:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Função para fechar modal
const closeModal = () => {
  showModal.value = false
}
</script>
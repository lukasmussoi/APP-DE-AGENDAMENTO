/**
 * PROPÓSITO: Formulário para recuperação de senha
 * IMPORTA: Componentes UI reutilizáveis
 * USADO_POR: Página de esqueci senha
 */

<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Importar componentes UI reutilizáveis
import Input from '~/shared/components/ui/Input.vue'
import Button from '~/shared/components/ui/Button.vue'

// Estado reativo
const email = ref('')
const isSubmitting = ref(false)

// Função de submit (placeholder - sem lógica ainda)
const handleSubmit = () => {
  // TODO: Implementar lógica de envio de email
  console.log('Email para recuperação:', email.value)
}
</script>
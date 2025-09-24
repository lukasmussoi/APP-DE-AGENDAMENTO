/**
 * PROPÓSITO: Formulário de login com campos de email e senha
 * IMPORTA: Input, Button, componentes base
 * USADO_POR: Página de login
 */
<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Header do formulário -->
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-neutral-900 mb-2">Entrar na sua conta</h2>
      <p class="text-neutral-600">Digite suas credenciais para acessar o sistema</p>
    </div>

    <!-- Formulário -->
    <form class="space-y-6" @submit.prevent="handleLogin">
      <!-- Campo Email -->
      <div>
        <Input
          v-model="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          :start-icon="EnvelopeIcon"
          required
          :disabled="isLoading"
        />
      </div>

      <!-- Campo Senha -->
      <div>
        <Input
          v-model="password"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Digite sua senha"
          :start-icon="LockClosedIcon"
          :end-icon="showPassword ? EyeSlashIcon : EyeIcon"
          @end-icon-click="showPassword = !showPassword"
          required
          :disabled="isLoading"
        />
      </div>

      <!-- Mensagem de erro -->
      <div v-if="error" class="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
        {{ error }}
      </div>

      <!-- Lembrar senha e Esqueceu senha -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            :disabled="isLoading"
          />
          <label for="remember-me" class="ml-2 block text-sm text-neutral-900">
            Lembrar-me
          </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
            Esqueceu a senha?
          </a>
        </div>
      </div>

      <!-- Botão de entrar -->
      <div>
        <Button
          type="submit"
          variant="solid"
          size="lg"
          class="w-full"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Entrando...
          </span>
          <span v-else>Entrar</span>
        </Button>
      </div>
    </form>

    <!-- Link para cadastro -->
    <div class="mt-6 text-center">
      <p class="text-sm text-neutral-600">
        Não tem uma conta?
        <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
          Criar conta
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '../../composables/useAuth'

// Reactive data
const email = ref('')
const password = ref('')
const showPassword = ref(false)

// Auth composable
const { login, isLoading, error } = useAuth()

// Handle login form submission
const handleLogin = async () => {
  if (!email.value || !password.value) return

  await login(email.value, password.value)
}
</script>
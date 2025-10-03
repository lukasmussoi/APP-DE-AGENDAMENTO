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
          id="email"
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
          id="password"
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
          <NuxtLink to="/esqueci-senha" class="font-medium text-primary-600 hover:text-primary-500">
            Esqueceu a senha?
          </NuxtLink>
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
            <ArrowPathIcon class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
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
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
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
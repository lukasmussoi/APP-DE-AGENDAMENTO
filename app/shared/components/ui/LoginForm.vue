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
    <form class="space-y-6">
      <!-- Campo Email -->
      <div>
        <Input
          v-model="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          :start-icon="EnvelopeIcon"
          required
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
        />
      </div>

      <!-- Lembrar senha e Esqueceu senha -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
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
        >
          Entrar
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

// Reactive data
const email = ref('')
const password = ref('')
const showPassword = ref(false)
</script>
/**
 * PROPÓSITO: Página de login com layout de duas colunas
 * IMPORTA: LoginForm, componentes de layout
 * USADO_POR: Rota /login
 */
<template>
  <div class="min-h-screen flex">
    <!-- Coluna Esquerda - Formulário -->
    <div class="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Logo mobile -->
        <div class="lg:hidden text-center mb-8">
          <div class="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <LockClosedIcon class="h-6 w-6 text-white" />
          </div>
          <h1 class="text-xl font-bold text-neutral-900">Sistema de Agendamento</h1>
        </div>

        <!-- Formulário de Login -->
        <LoginForm />
      </div>
    </div>

    <!-- Coluna Direita - Branding -->
    <div class="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 bg-gradient-to-br from-primary-600 to-primary-800">
      <div class="mx-auto w-full max-w-md">
        <div class="text-center">
          <!-- Logo/Ícone -->
          <div class="mx-auto h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-8">
            <LockClosedIcon class="h-8 w-8 text-white" />
          </div>

          <!-- Título e descrição -->
          <h1 class="text-3xl font-bold text-white mb-4">
            Sistema de Agendamento
          </h1>
          <p class="text-lg text-primary-100 mb-8">
            Gerencie seus agendamentos de forma simples e eficiente
          </p>

          <!-- Features -->
          <div class="space-y-4 text-left">
            <div class="flex items-center text-primary-100">
              <CheckIcon class="h-5 w-5 mr-3 text-primary-200" />
              Agendamentos online
            </div>
            <div class="flex items-center text-primary-100">
              <CheckIcon class="h-5 w-5 mr-3 text-primary-200" />
              Gestão de clientes
            </div>
            <div class="flex items-center text-primary-100">
              <CheckIcon class="h-5 w-5 mr-3 text-primary-200" />
              Relatórios detalhados
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '../shared/components/ui/LoginForm.vue'
import { LockClosedIcon, CheckIcon } from '@heroicons/vue/24/outline'

// Layout vazio para login (sem sidebar/header)
definePageMeta({
  layout: false
})
</script>
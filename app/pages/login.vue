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
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-8 0H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-4" />
            </svg>
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
            <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-8 0H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-4" />
            </svg>
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
              <svg class="h-5 w-5 mr-3 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Agendamentos online
            </div>
            <div class="flex items-center text-primary-100">
              <svg class="h-5 w-5 mr-3 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Gestão de clientes
            </div>
            <div class="flex items-center text-primary-100">
              <svg class="h-5 w-5 mr-3 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
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
</script>
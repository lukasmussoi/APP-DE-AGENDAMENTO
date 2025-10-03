/**
 * PROPÓSITO: Página de recuperação de senha (destino do link do email)
 * IMPORTA: Componente de formulário de recuperação de senha
 * USADO_POR: Usuários que clicaram no link de recuperação de senha
 */

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Redefinir Senha
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Digite sua nova senha abaixo
        </p>
      </div>

      <RecuperarSenhaForm />
    </div>
  </div>
</template>

<script setup lang="ts">
// Configurar página para não usar layout (acessível sem login)
definePageMeta({
  layout: false
})

// Importar componente do módulo de usuários
import RecuperarSenhaForm from '../modules/usuarios/components/RecuperarSenhaForm.vue'
</script>
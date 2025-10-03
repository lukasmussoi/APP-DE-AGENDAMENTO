/**
 * PROPÓSITO: Página de recuperação de senha
 * IMPORTA: Componente de formulário de esqueci senha
 * USADO_POR: Usuários que esqueceram a senha
 */

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Esqueceu sua senha?
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Digite seu e-mail e enviaremos um link para redefinir sua senha
        </p>
      </div>

      <EsqueciSenhaForm />
    </div>
  </div>
</template>

<script setup lang="ts">
// Configurar página para não usar layout (acessível sem login)
definePageMeta({
  layout: false
})

// Importar componente do módulo de usuários
import EsqueciSenhaForm from '../modules/usuarios/components/EsqueciSenhaForm.vue'
</script>
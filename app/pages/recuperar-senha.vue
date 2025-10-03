/**
 * PROPÓSITO: Página de recuperação/confirmação de senha (destino do link do email)
 * IMPORTA: Componente de formulário de recuperação de senha, useSupabaseUser
 * USADO_POR: Usuários que clicaram no link de recuperação de senha
 */

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Loading inicial -->
      <div v-if="isProcessingToken" class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Verificando link de recuperação...</p>
      </div>

      <!-- Formulário de redefinição -->
      <div v-else>
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Redefinir Senha
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Digite sua nova senha abaixo
          </p>
        </div>



        <!-- Formulário temporário inline para teste -->
        <form @submit.prevent="handleSubmit" class="space-y-6 mt-8">
          <!-- Campo Nova Senha -->
          <div>
            <label for="senha" class="block text-sm font-medium text-gray-700 mb-2">
              Nova Senha
            </label>
            <input
              id="senha"
              type="password"
              v-model="senha"
              placeholder="Digite a nova senha"
              required
              minlength="6"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Campo Confirmar Nova Senha -->
          <div>
            <label for="confirmarSenha" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nova Senha
            </label>
            <input
              id="confirmarSenha"
              type="password"
              v-model="confirmarSenha"
              placeholder="Confirme a nova senha"
              required
              minlength="6"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Botão Salvar -->
          <div>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="isSubmitting">Atualizando...</span>
              <span v-else>Redefinir Senha</span>
            </button>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { useAuth } from '~/shared/composables/useAuth'

// Configurar página para não usar layout (acessível sem login)
definePageMeta({
  layout: false
})

// Estados reativos
const isProcessingToken = ref(true)
const canResetPassword = ref(false)

// Estados do formulário
const senha = ref('')
const confirmarSenha = ref('')
const isSubmitting = ref(false)

// Composable de autenticação
const { updatePassword } = useAuth()

// Função para processar o token de recovery do Supabase
const handlePasswordRecovery = async () => {
  try {
    const user = useSupabaseUser()
    const route = useRoute()
    
    console.log('URL atual:', route.fullPath)
    console.log('Query params:', route.query)
    console.log('Estado inicial do usuário:', user.value)
    
    // Aguardar mais tempo para o Supabase processar o token automaticamente
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    console.log('Estado do usuário após aguardar:', user.value)
    
    // Verificar se o usuário foi autenticado pelo token OU se há parâmetros na URL
    if (user.value || route.query.token) {
      console.log('Usuário autenticado ou token presente - permitindo reset')
      canResetPassword.value = true
      if (user.value) {
        toast.success('Link de recuperação válido. Defina sua nova senha.')
      } else {
        toast.info('Processando link de recuperação...')
      }
    } else {
      console.log('Nenhum token ou usuário encontrado')
      toast.error('Link de recuperação inválido ou expirado.')
      canResetPassword.value = false
    }
  } catch (err) {
    console.error('Erro ao processar token de recovery:', err)
    toast.error('Erro ao processar link de recuperação.')
    canResetPassword.value = false
  } finally {
    isProcessingToken.value = false
  }
}

// Watch para monitorar mudanças no usuário
const user = useSupabaseUser()
watch(user, (newUser) => {
  console.log('Mudança detectada no usuário:', newUser)
  if (newUser && !canResetPassword.value) {
    console.log('Usuário autenticado - habilitando formulário')
    canResetPassword.value = true
    isProcessingToken.value = false
    toast.success('Link de recuperação válido. Defina sua nova senha.')
  }
}, { immediate: true })

// Função de submit do formulário
const handleSubmit = async () => {
  // Validações básicas
  if (senha.value !== confirmarSenha.value) {
    toast.error('As senhas não coincidem')
    return
  }

  if (senha.value.length < 6) {
    toast.error('A senha deve ter pelo menos 6 caracteres')
    return
  }

  isSubmitting.value = true

  try {
    // Usar a função updatePassword do composable useAuth
    const result = await updatePassword(senha.value)

    if (result.success) {
      // Sucesso
      toast.success('Senha redefinida com sucesso! Você será redirecionado automaticamente.')

      // Limpar campos
      senha.value = ''
      confirmarSenha.value = ''

      // Redirecionar para dashboard após alguns segundos
      setTimeout(() => {
        navigateTo('/')
      }, 2000)
    } else {
      toast.error(result.error || 'Erro ao redefinir senha. Tente novamente.')
    }

  } catch (err) {
    console.error('Erro ao redefinir senha:', err)
    toast.error('Erro inesperado. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

// Executar quando o componente montar
onMounted(() => {
  handlePasswordRecovery()
})
</script>
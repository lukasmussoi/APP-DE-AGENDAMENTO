/**
 * PROPÓSITO: Formulário para redefinir senha após clicar no link do email
 * IMPORTA: Componentes UI reutilizáveis, Supabase
 * USADO_POR: Página de recuperar senha
 */

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Campo Nova Senha -->
    <div>
      <label for="senha" class="block text-sm font-medium text-gray-700 mb-2">
        Nova Senha
      </label>
      <Input
        id="senha"
        type="password"
        v-model="senha"
        placeholder="Digite a nova senha"
        required
        :minlength="6"
      />
    </div>

    <!-- Campo Confirmar Nova Senha -->
    <div>
      <label for="confirmarSenha" class="block text-sm font-medium text-gray-700 mb-2">
        Confirmar Nova Senha
      </label>
      <Input
        id="confirmarSenha"
        type="password"
        v-model="confirmarSenha"
        placeholder="Confirme a nova senha"
        required
        :minlength="6"
      />
    </div>

    <!-- Botão Salvar -->
    <div>
      <Button type="submit" variant="primary" class="w-full" :disabled="isSubmitting">
        <span v-if="isSubmitting">Atualizando...</span>
        <span v-else>Redefinir Senha</span>
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
import { toast } from 'vue3-toastify'

// Importar componentes UI reutilizáveis
import Input from '~/shared/components/ui/Input.vue'
import Button from '~/shared/components/ui/Button.vue'

// Estado reativo para os campos
const senha = ref('')
const confirmarSenha = ref('')

// Estado para feedback
const isSubmitting = ref(false)

// Função de submit
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
    const supabase = useSupabaseClient()

    // Atualizar senha usando Supabase Auth
    const { data, error } = await supabase.auth.updateUser({
      password: senha.value
    })

    if (error) {
      console.error('Erro ao atualizar senha:', error)
      toast.error('Erro ao redefinir senha. Tente novamente.')
      return
    }

    // Sucesso
    toast.success('Senha redefinida com sucesso!')

    // Limpar campos
    senha.value = ''
    confirmarSenha.value = ''

    // Redirecionar para login após alguns segundos
    setTimeout(() => {
      navigateTo('/login')
    }, 2000)

  } catch (err) {
    console.error('Erro ao redefinir senha:', err)
    toast.error('Erro inesperado. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
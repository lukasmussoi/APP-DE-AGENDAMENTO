/**
 * PROPÓSITO: Formulário para edição de perfil do usuário (nome e senha)
 * IMPORTA: Componentes UI reutilizáveis
 * USADO_POR: Página de perfil
 */

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Campo Nome de Usuário -->
    <div>
      <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">
        Nome de Usuário
      </label>
      <Input
        id="nome"
        v-model="nome"
        placeholder="Digite seu nome"
        required
      />
    </div>

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
      />
    </div>

    <!-- Botão Salvar -->
    <div class="flex justify-end">
      <Button type="submit" variant="primary">
        Salvar Alterações
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Importar componentes UI reutilizáveis
import Input from '~/shared/components/ui/Input.vue'
import Button from '~/shared/components/ui/Button.vue'

// Estado reativo para os campos
const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')

// Função de submit (placeholder por enquanto)
const handleSubmit = () => {
  // TODO: Implementar lógica de atualização de perfil
  console.log('Salvando perfil:', { nome: nome.value, email: email.value, senha: senha.value, confirmarSenha: confirmarSenha.value })
}
</script>
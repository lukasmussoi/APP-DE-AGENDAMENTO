/**
 * PROPÓSITO: Página de teste para avaliar os componentes Input, Button e Table
 * IMPORTA: Componentes UI (Input, Button, DataTable), Heroicons, Toast
 * USADO_POR: Rota /teste
 */

<template>
  <div class="w-full max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow p-8">
        <h1 class="text-2xl font-bold text-neutral-900 mb-6">Teste de Componentes</h1>
        
        <div class="space-y-8">
          <!-- Inputs com ícones -->
          <div>
            <h2 class="text-lg font-semibold text-neutral-800 mb-4">Inputs com Ícones</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input v-model="name" label="Nome" placeholder="Digite seu nome" :startIcon="UserIcon" />
              <Input v-model="email" label="Email" placeholder="seu@email.com" type="email" :startIcon="EnvelopeIcon" />
              <Input v-model="phone" label="Telefone" placeholder="(11) 99999-9999" type="tel" :startIcon="PhoneIcon" />
              <Input v-model="password" label="Senha" placeholder="Digite sua senha" type="password" :startIcon="LockClosedIcon" />
            </div>
          </div>

          <!-- Botões -->
          <div class="flex items-center gap-4">
            <Button @click="onSubmit">Salvar</Button>
            <Button variant="outline" @click="onReset">Limpar</Button>
          </div>

          <!-- Toast Examples -->
          <div>
            <h2 class="text-lg font-semibold text-neutral-800 mb-4">Exemplos de Toast</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button @click="showSuccessToast" variant="solid" class="bg-success-600 hover:bg-success-700">
                Success
              </Button>
              <Button @click="showErrorToast" variant="solid" class="bg-error-600 hover:bg-error-700">
                Error
              </Button>
              <Button @click="showWarningToast" variant="solid" class="bg-warning-600 hover:bg-warning-700">
                Warning
              </Button>
              <Button @click="showInfoToast" variant="outline">
                Info
              </Button>
            </div>
          </div>

          <!-- Valores atuais -->
          <Card>
            <template #header>
              <h3 class="text-sm font-semibold text-neutral-800">Valores Atuais</h3>
            </template>
            <div class="space-y-2 text-sm">
              <p><strong>Nome:</strong> {{ name || 'Não informado' }}</p>
              <p><strong>Email:</strong> {{ email || 'Não informado' }}</p>
              <p><strong>Telefone:</strong> {{ phone || 'Não informado' }}</p>
              <p><strong>Senha:</strong> {{ password ? '••••••••' : 'Não informada' }}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import Input from '../shared/components/ui/Input.vue'
import Button from '../shared/components/ui/Button.vue'
import Card from '../shared/components/ui/Card.vue'
import { ref } from 'vue'
import { UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')

const { $toast } = useNuxtApp()

function onSubmit() {
  console.log('Salvar clicado', { name: name.value, email: email.value, phone: phone.value })
  $toast.success('Dados salvos com sucesso!')
}

function onReset() {
  name.value = ''
  email.value = ''
  phone.value = ''
  password.value = ''
  $toast.info('Formulário limpo')
}

function showSuccessToast() {
  $toast.success('Operação realizada com sucesso!')
}

function showErrorToast() {
  $toast.error('Ocorreu um erro inesperado!')
}

function showWarningToast() {
  $toast.warning('Atenção: verifique os dados antes de continuar')
}

function showInfoToast() {
  $toast.info('Informação importante sobre o sistema')
}
</script>
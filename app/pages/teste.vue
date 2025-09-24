/**
 * PROPÓSITO: Página de teste para avaliar os componentes Input, Button e Table
 * IMPORTA: Componentes UI (Input, Button, DataTable), Heroicons, Toast
 * USADO_POR: Rota /teste
 */
<template>
  <div class="min-h-screen flex items-start justify-center py-20 bg-gray-50">
    <div class="w-full max-w-4xl bg-white rounded-lg shadow p-8">
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

        <!-- Cards com componentes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <template #header>
              <h3 class="text-sm font-semibold text-neutral-800">Card de Exemplo</h3>
            </template>
            <p class="text-neutral-600">Um card minimalista para agrupar conteúdo.</p>
            <div class="mt-4 flex items-center gap-2">
              <Badge variant="info">Info</Badge>
              <Badge variant="success">Ativo</Badge>
            </div>
          </Card>

          <Card>
            <template #header>
              <h3 class="text-sm font-semibold text-neutral-800">Controles</h3>
            </template>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Icon><CheckCircleIcon class="w-5 h-5 text-primary-600" /></Icon>
                <span class="text-neutral-700">Ativar recurso</span>
              </div>
              <Toggle v-model="toggled" />
            </div>
          </Card>
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
            <p><strong>Toggle:</strong> {{ toggled ? 'Ativado' : 'Desativado' }}</p>
          </div>
        </Card>
      </div>

      <!-- Seção de Tabelas -->
      <div class="space-y-8 mt-12">
        <h2 class="text-xl font-bold text-neutral-900">Componentes de Tabela</h2>

        <!-- Tabela de Agendamentos -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-neutral-800">Agendamentos</h3>
          </template>

          <DataTable
            title="Lista de Agendamentos"
            :columns="appointmentColumns"
            :items="appointments"
            :selectable="true"
            :selected-items="selectedAppointments"
            :editable="true"
            :deletable="true"
            empty-message="Nenhum agendamento encontrado"
            @edit="onAppointmentEdit"
            @delete="onAppointmentDelete"
            @item-select="onAppointmentSelect"
          >
            <template #actions>
              <Button @click="addNewAppointment" size="sm">
                <PlusIcon class="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </template>

            <template #column-price="{ value }">
              R$ {{ value.toFixed(2) }}
            </template>
          </DataTable>
        </Card>

        <!-- Tabela de Clientes -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-neutral-800">Clientes</h3>
          </template>

          <DataTable
            title="Lista de Clientes"
            :columns="clientColumns"
            :items="clients"
            :editable="true"
            :deletable="true"
            empty-message="Nenhum cliente encontrado"
            @edit="onClientEdit"
            @delete="onClientDelete"
          >
            <template #actions>
              <Button size="sm">
                <PlusIcon class="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </template>
          </DataTable>
        </Card>

        <!-- Tabela com Paginação -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-neutral-800">Agendamentos com Paginação</h3>
          </template>

          <DataTable
            :columns="appointmentColumns"
            :items="appointments"
            :pagination="true"
            :current-page="currentPage"
            :items-per-page="2"
            :total-items="appointments.length"
            :editable="true"
            :deletable="true"
            @edit="onAppointmentEdit"
            @delete="onAppointmentDelete"
            @page-change="currentPage = $event"
          >
            <template #column-price="{ value }">
              R$ {{ value.toFixed(2) }}
            </template>
          </DataTable>
        </Card>
      </div>

      <!-- Seção de Tabela com Abas -->
      <div class="space-y-8 mt-12">
        <h2 class="text-xl font-bold text-neutral-900">Tabela com Abas</h2>

        <Card>
          <TableTabs
            title="Agendamentos por Status"
            subtitle="Organize os agendamentos por status usando abas"
            :tabs="tabsData"
            @edit="onAppointmentEdit"
            @delete="onAppointmentDelete"
          >
            <template #actions="{ activeTab }">
              <Button v-if="activeTab === 'ativos'" @click="addNewAppointment" size="sm">
                <PlusIcon class="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </template>

            <template #column-price="{ value }">
              R$ {{ value.toFixed(2) }}
            </template>
          </TableTabs>
        </Card>
      </div>

      <!-- Seção de Transferência de Itens -->
      <div class="space-y-8 mt-12">
        <h2 class="text-xl font-bold text-neutral-900">Transferência de Itens</h2>

        <Card>
          <TableTransfer
            title="Selecionar Serviços"
            subtitle="Mova os serviços disponíveis para a lista de serviços oferecidos"
            source-title="Serviços Disponíveis"
            target-title="Serviços Oferecidos"
            :source-columns="transferColumns"
            :target-columns="[...transferColumns, { key: 'actions', label: 'Ações', type: 'actions' as const }]"
            :all-items="allServices"
            :selected-items="selectedServices"
            :searchable="true"
            :sortable="true"
            :allow-comparison="true"
            :show-controls="true"
            :show-category-filter="true"
            :show-item-details="true"
            :show-pagination="true"
            :items-per-page="8"
            :max-items="6"
            :min-items="1"
            :drag-enabled="true"
            @update:selected-items="selectedServices = $event"
            @item-added="$toast.success('Serviço adicionado!')"
            @item-removed="$toast.info('Serviço removido')"
            @validation-error="handleValidationError"
          >
            <template #summary="{ available, selected }">
              <div class="flex items-center gap-4 text-sm">
                <span class="text-neutral-600">
                  Total: {{ available.length + selected.length }} serviços
                </span>
                <span class="text-success-600">
                  Selecionados: {{ selected.length }}/6 máx.
                </span>
              </div>
            </template>
          </TableTransfer>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from '../shared/components/ui/Input.vue'
import Button from '../shared/components/ui/Button.vue'
import Card from '../shared/components/ui/Card.vue'
import Badge from '../shared/components/ui/Badge.vue'
import Toggle from '../shared/components/ui/Toggle.vue'
import Icon from '../shared/components/ui/Icon.vue'
import DataTable from '../shared/components/ui/DataTable.vue'
import TableTabs from '../shared/components/ui/TableTabs.vue'
import TableTransfer from '../shared/components/ui/TableTransfer.vue'
import { ref } from 'vue'
import { UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon, CheckCircleIcon, PlusIcon, ClockIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const toggled = ref(false)

const { $toast } = useNuxtApp()

// Dados de exemplo para tabelas
const appointments = ref([
  {
    id: 1,
    client: 'João Silva',
    service: 'Corte de Cabelo',
    date: '2024-01-15',
    time: '14:30',
    status: 'Confirmado',
    price: 45.00
  },
  {
    id: 2,
    client: 'Maria Santos',
    service: 'Coloração',
    date: '2024-01-15',
    time: '16:00',
    status: 'Pendente',
    price: 120.00
  },
  {
    id: 3,
    client: 'Pedro Oliveira',
    service: 'Barba',
    date: '2024-01-16',
    time: '10:00',
    status: 'Cancelado',
    price: 30.00
  },
  {
    id: 4,
    client: 'Ana Costa',
    service: 'Hidratação',
    date: '2024-01-16',
    time: '15:30',
    status: 'Confirmado',
    price: 80.00
  }
])

const clients = ref([
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-1111',
    status: 'Ativo',
    lastVisit: '2024-01-10'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 99999-2222',
    status: 'Ativo',
    lastVisit: '2024-01-08'
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro@email.com',
    phone: '(11) 88888-3333',
    status: 'Inativo',
    lastVisit: '2023-12-15'
  }
])

// Colunas para tabela de agendamentos
const appointmentColumns = [
  { key: 'client', label: 'Cliente', sortable: true },
  { key: 'service', label: 'Serviço', sortable: true },
  { key: 'date', label: 'Data', type: 'date' as const, sortable: true },
  { key: 'time', label: 'Horário' },
  { key: 'status', label: 'Status', type: 'badge' as const, sortable: true },
  { key: 'price', label: 'Valor', cellClass: 'text-right font-medium' },
  { key: 'actions', label: 'Ações', type: 'actions' as const }
]

// Colunas para tabela de clientes
const clientColumns = [
  { key: 'name', label: 'Nome', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Telefone' },
  { key: 'status', label: 'Status', type: 'badge' as const, sortable: true },
  { key: 'lastVisit', label: 'Última Visita', type: 'date' as const, sortable: true },
  { key: 'actions', label: 'Ações', type: 'actions' as const }
]

// Estado da tabela
const selectedAppointments = ref<any[]>([])
const currentPage = ref(1)

// Dados para TableTabs
const tabsData = [
  {
    key: 'ativos',
    label: 'Ativos',
    icon: CheckCircleIcon,
    badge: 2,
    badgeVariant: 'success' as const,
    title: 'Agendamentos Ativos',
    columns: appointmentColumns,
    items: appointments.value.filter(a => a.status === 'Confirmado'),
    searchable: true,
    selectable: true,
    editable: true,
    deletable: true,
    pagination: false
  },
  {
    key: 'pendentes',
    label: 'Pendentes',
    icon: ClockIcon,
    badge: 1,
    badgeVariant: 'warning' as const,
    title: 'Agendamentos Pendentes',
    columns: appointmentColumns,
    items: appointments.value.filter(a => a.status === 'Pendente'),
    searchable: true,
    selectable: false,
    editable: true,
    deletable: false,
    pagination: false
  },
  {
    key: 'cancelados',
    label: 'Cancelados',
    icon: XCircleIcon,
    badge: 1,
    badgeVariant: 'error' as const,
    title: 'Agendamentos Cancelados',
    columns: appointmentColumns,
    items: appointments.value.filter(a => a.status === 'Cancelado'),
    searchable: true,
    selectable: false,
    editable: false,
    deletable: true,
    pagination: false
  }
]

// Dados para TableTransfer
const allServices = ref([
  { id: 1, name: 'Corte de Cabelo', category: 'Cabelo', duration: 60, price: 45.00 },
  { id: 2, name: 'Coloração', category: 'Cabelo', duration: 120, price: 120.00 },
  { id: 3, name: 'Barba', category: 'Barba', duration: 30, price: 30.00 },
  { id: 4, name: 'Hidratação', category: 'Cabelo', duration: 90, price: 80.00 },
  { id: 5, name: 'Sobrancelha', category: 'Sobrancelha', duration: 15, price: 20.00 },
  { id: 6, name: 'Limpeza de Pele', category: 'Pele', duration: 60, price: 70.00 },
  { id: 7, name: 'Massagem', category: 'Relaxamento', duration: 90, price: 100.00 },
  { id: 8, name: 'Manicure', category: 'Unhas', duration: 45, price: 35.00 }
])

const selectedServices = ref<any[]>([
  { id: 1, name: 'Corte de Cabelo', category: 'Cabelo', duration: 60, price: 45.00 },
  { id: 3, name: 'Barba', category: 'Barba', duration: 30, price: 30.00 }
])

const transferColumns = [
  { key: 'name', label: 'Serviço', sortable: true },
  { key: 'category', label: 'Categoria', sortable: true },
  { key: 'duration', label: 'Duração (min)', type: 'text' as const },
  { key: 'price', label: 'Preço', type: 'currency' as const }
]

function onSubmit() {
  console.log('Salvar clicado', { name: name.value, email: email.value, phone: phone.value })
  $toast.success('Dados salvos com sucesso!')
}

function onReset() {
  name.value = ''
  email.value = ''
  phone.value = ''
  password.value = ''
  toggled.value = false
  $toast.info('Formulário limpo')
}

function showSuccessToast() {
  $toast.success('Operação realizada com sucesso!', {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  })
}

function showErrorToast() {
  $toast.error('Ocorreu um erro inesperado!', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  })
}

function showWarningToast() {
  $toast.warning('Atenção: verifique os dados antes de continuar', {
    position: 'top-center',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  })
}

function showInfoToast() {
  $toast.info('Informação importante sobre o sistema', {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  })
}

// Funções para tabelas
function onAppointmentEdit(appointment: any) {
  $toast.info(`Editando agendamento de ${appointment.client}`)
}

function onAppointmentDelete(appointment: any) {
  $toast.warning(`Excluindo agendamento de ${appointment.client}`)
}

function onClientEdit(client: any) {
  $toast.info(`Editando cliente ${client.name}`)
}

function onClientDelete(client: any) {
  $toast.warning(`Excluindo cliente ${client.name}`)
}

function onAppointmentSelect(appointment: any) {
  const index = selectedAppointments.value.findIndex(a => a.id === appointment.id)
  if (index > -1) {
    selectedAppointments.value.splice(index, 1)
  } else {
    selectedAppointments.value.push(appointment)
  }
}

function addNewAppointment() {
  $toast.success('Novo agendamento criado!')
}

function handleValidationError(errors: string[]) {
  if (errors.length > 0) {
    $toast.error(errors[0])
  }
}
</script>

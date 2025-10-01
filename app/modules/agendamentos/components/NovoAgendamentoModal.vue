/**
 * PROPÓSITO: Modal para criação de novo agendamento
 * IMPORTA: Modal, Cliente, Agendamento
 * USADO_POR: AgendamentoManager.vue
 */

<template>
  <ClientOnly>
    <Modal
      :model-value="modelValue"
      title="Novo Agendamento"
      confirm-text="Salvar"
      cancel-text="Cancelar"
      :loading="saving"
      @confirm="handleSave"
      @cancel="handleCancel"
      @update:model-value="handleUpdateModelValue"
    >
      <div class="space-y-4">
        <!-- Campo Cliente -->
        <div>
          <label for="cliente" class="block text-sm font-medium text-neutral-700 mb-2">
            Cliente
          </label>
          <SearchableSelect
            :items="clientes"
            :search-key="['nome', 'email']"
            display-key="nome"
            subtitle-key="email"
            placeholder="Pesquisar cliente..."
            input-id="cliente"
            :model-value="clienteSelecionado"
            @select="selecionarCliente"
            @clear="limparSelecaoCliente"
          />
        </div>

        <!-- Campo Profissional (somente leitura) -->
        <div>
          <label for="profissional" class="block text-sm font-medium text-neutral-700 mb-2">
            Profissional
          </label>
          <input
            id="profissional"
            :value="userEspecialidade ? `${userEspecialidade.nome} - ${userEspecialidade.especialidade}` : 'Carregando...'"
            readonly
            class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm bg-gray-50 text-gray-700"
          />
        </div>

        <!-- Campo Data -->
        <div>
          <label for="data" class="block text-sm font-medium text-neutral-700 mb-2">
            Data
          </label>
          <select
            id="data"
            v-model="selectedData"
            class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione uma data...</option>
            <option
              v-for="dia in diasSemana"
              :key="dia.toISOString()"
              :value="dia.toISOString().split('T')[0]"
            >
              {{ dia.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) }}
            </option>
          </select>
        </div>

        <!-- Campo Hora Início -->
        <div>
          <label for="horaInicio" class="block text-sm font-medium text-neutral-700 mb-2">
            Hora Início
          </label>
          <select
            id="horaInicio"
            v-model="selectedHoraInicio"
            :disabled="!selectedData"
            class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">Selecione a hora de início...</option>
            <option
              v-for="hora in horasDisponiveis"
              :key="hora"
              :value="hora"
            >
              {{ hora }}
            </option>
          </select>
        </div>

        <!-- Campo Hora Fim -->
        <div>
          <label for="horaFim" class="block text-sm font-medium text-neutral-700 mb-2">
            Hora Fim
          </label>
          <select
            id="horaFim"
            v-model="selectedHoraFim"
            :disabled="!selectedData"
            class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">Selecione a hora de fim...</option>
            <option
              v-for="hora in horasDisponiveis"
              :key="hora"
              :value="hora"
            >
              {{ hora }}
            </option>
          </select>
        </div>

        <!-- Campo Título -->
        <div>
          <label for="titulo" class="block text-sm font-medium text-neutral-700 mb-2">
            Título
          </label>
          <input
            id="titulo"
            v-model="tituloAgendamento"
            type="text"
            placeholder="Digite o título do agendamento"
            class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Campo Descrição -->
        <div>
          <label for="descricao" class="block text-sm font-medium text-neutral-700 mb-2">
            Descrição
          </label>
          <textarea
            id="descricao"
            v-model="descricaoAgendamento"
            rows="3"
            placeholder="Digite a descrição do agendamento"
            class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <p v-if="modalError" class="mt-1 text-sm text-red-600">
          {{ modalError }}
        </p>
      </div>
    </Modal>
  </ClientOnly>
</template>

<script setup lang="ts">
import Modal from '../../../shared/components/ui/Modal.vue'
import SearchableSelect from '../../../shared/components/ui/SearchableSelect.vue'
import type { Cliente } from '../../clientes/types/clientes.types'

interface Props {
  modelValue: boolean
  userEspecialidade: { id: number | null; nome: string; especialidade: string } | null
  clientes: Cliente[]
  diasSemana: Date[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [data: {
    clienteId: number
    profissionalId: number
    data: string
    horaInicio: string
    horaFim: string
    titulo: string
    descricao: string | null
  }]
  'cancel': []
}>()

// Estado do modal
const saving = ref(false)
const modalError = ref<string | null>(null)

// Campos do formulário
const selectedClienteId = ref<number | null>(null)
const selectedData = ref<string>('')
const selectedHoraInicio = ref<string>('')
const selectedHoraFim = ref<string>('')
const tituloAgendamento = ref<string>('')
const descricaoAgendamento = ref<string>('')

// Horas disponíveis (8:00 às 22:00)
const horasDisponiveis = computed(() => {
  const horas = []
  for (let i = 8; i <= 22; i++) {
    const hora = i.toString().padStart(2, '0') + ':00'
    horas.push(hora)
  }
  return horas
})

// Cliente selecionado
const clienteSelecionado = computed(() => {
  if (!selectedClienteId.value) return null
  return props.clientes.find(cliente => cliente.id === selectedClienteId.value) || null
})

// Limpar campos quando o modal abrir
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    selectedClienteId.value = null
    selectedData.value = ''
    selectedHoraInicio.value = ''
    selectedHoraFim.value = ''
    tituloAgendamento.value = ''
    descricaoAgendamento.value = ''
    modalError.value = null
  }
})

// Função para selecionar cliente
const selecionarCliente = (cliente: Cliente) => {
  selectedClienteId.value = cliente.id
}

// Função para limpar seleção de cliente
const limparSelecaoCliente = () => {
  selectedClienteId.value = null
}

// Função para salvar agendamento
const handleSave = async () => {
  // Validações
  if (!selectedClienteId.value) {
    modalError.value = 'Selecione um cliente'
    return
  }

  if (!props.userEspecialidade?.id) {
    modalError.value = 'Profissional não identificado'
    return
  }

  if (!selectedData.value) {
    modalError.value = 'Selecione uma data'
    return
  }

  if (!selectedHoraInicio.value) {
    modalError.value = 'Selecione a hora de início'
    return
  }

  if (!selectedHoraFim.value) {
    modalError.value = 'Selecione a hora de fim'
    return
  }

  if (!tituloAgendamento.value.trim()) {
    modalError.value = 'Digite um título para o agendamento'
    return
  }

  try {
    saving.value = true
    modalError.value = null

    emit('save', {
      clienteId: selectedClienteId.value,
      profissionalId: props.userEspecialidade.id,
      data: selectedData.value,
      horaInicio: selectedHoraInicio.value,
      horaFim: selectedHoraFim.value,
      titulo: tituloAgendamento.value.trim(),
      descricao: descricaoAgendamento.value.trim() || null
    })

  } catch (err: any) {
    modalError.value = err.message || 'Erro ao salvar agendamento'
  } finally {
    saving.value = false
  }
}

// Função para cancelar agendamento
const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

// Função para atualizar o model value
const handleUpdateModelValue = (value: boolean) => {
  emit('update:modelValue', value)
}
</script>
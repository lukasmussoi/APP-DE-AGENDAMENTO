/**
 * PROPÓSITO: Modal para criação de novo agendamento
 * IMPORTA: Modal, Cliente, Agendamento
 * USADO_POR: AgendamentoManager.vue
 */

<template>
  <ClientOnly>
    <Modal
      :model-value="modelValue"
      :title="modoEdicao ? 'Editar Agendamento' : 'Novo Agendamento'"
      :confirm-text="horarioTemConflito ? 'Horário Indisponível' : (modoEdicao ? 'Atualizar' : 'Salvar')"
      cancel-text="Cancelar"
      :loading="saving"
      :confirm-disabled="horarioTemConflito || saving"
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
            v-if="!modoEdicao"
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
          <input
            v-else
            id="cliente"
            :value="clienteSelecionado ? `${clienteSelecionado.nome} - ${clienteSelecionado.email}` : 'Cliente não encontrado'"
            readonly
            class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm bg-gray-50 text-gray-700"
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
          <div class="flex items-center space-x-3">
            <select
              id="data"
              v-model="selectedData"
              :disabled="modoEdicao"
              class="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
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
            <ColorPicker
              v-model="selectedCor"
              :cores="coresDisponiveis"
            />
          </div>
        </div>

        <!-- Campo Hora Início e Hora Fim lado a lado -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Campo Hora Início -->
          <div>
            <label for="horaInicio" class="block text-sm font-medium text-neutral-700 mb-2">
              Hora Início
            </label>
            <select
              id="horaInicio"
              v-model="selectedHoraInicio"
              :disabled="!selectedData || modoEdicao"
              class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Selecione a hora de início...</option>
              <option
                v-for="horario in horariosDisponiveis"
                :key="horario.hora"
                :value="horario.hora"
                :disabled="!horario.disponivel"
                :class="horario.disponivel ? '' : 'text-gray-400'"
              >
                {{ horario.hora }} {{ horario.disponivel ? '' : '(ocupado)' }}
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
              :disabled="!selectedData || modoEdicao"
              class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Selecione a hora de fim...</option>
              <option
                v-for="horario in horariosDisponiveis"
                :key="horario.hora"
                :value="horario.hora"
                :disabled="!horario.disponivel"
                :class="horario.disponivel ? '' : 'text-gray-400'"
              >
                {{ horario.hora }} {{ horario.disponivel ? '' : '(ocupado)' }}
              </option>
            </select>
          </div>
        </div>

        <!-- Aviso de conflito de horário -->
        <div v-if="horarioTemConflito" class="bg-red-50 border border-red-200 rounded-md p-3">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                ⚠️ Horário Indisponível
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>O horário selecionado ({{ selectedHoraInicio }} - {{ selectedHoraFim }}) conflita com um agendamento existente.</p>
                <p class="mt-1">Escolha um horário diferente para continuar.</p>
              </div>
            </div>
          </div>
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

        <!-- Botão para cancelar agendamento (apenas no modo edição) -->
        <div v-if="modoEdicao" class="pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="handleCancelarAgendamento"
            :disabled="saving"
            class="w-full bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            🗑️ Cancelar Agendamento
          </button>
          <p class="text-xs text-gray-500 mt-1 text-center">
            Esta ação não pode ser desfeita
          </p>
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
import ColorPicker from '../../../shared/components/ui/ColorPicker.vue'
import { useValidacaoHorarios } from '../composables/useValidacaoHorarios'
import type { Cliente } from '../../clientes/types/clientes.types'
import type { Agendamento } from '../types/agendamentos.types'

interface Props {
  modelValue: boolean
  userEspecialidade: { id: number | null; nome: string; especialidade: string } | null
  clientes: Cliente[]
  diasSemana: Date[]
  agendamentos: Agendamento[]
  loading?: boolean
  agendamentoId?: number | null
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
    cor: string
  }]
  'cancel': []
  'cancelar-agendamento': [id: number]
}>()

// Usar composable de validação de horários
const { getHorariosDisponiveis, horarioValido, horarioConflitaComAgendamentos } = useValidacaoHorarios()

// Estado do modal
const modalError = ref<string | null>(null)

// Usar loading prop ou fallback para saving interno
const saving = computed(() => props.loading || false)

// Verificar se está em modo de edição
const modoEdicao = computed(() => !!props.agendamentoId)

// Buscar agendamento para editar
const agendamentoAtual = computed(() => {
  if (!props.agendamentoId) return null
  return props.agendamentos.find(ag => ag.id === props.agendamentoId) || null
})

// Campos do formulário
const selectedClienteId = ref<number | null>(null)
const selectedData = ref<string>('')
const selectedHoraInicio = ref<string>('')
const selectedHoraFim = ref<string>('')
const tituloAgendamento = ref<string>('')
const descricaoAgendamento = ref<string>('')
const selectedCor = ref<string>('#deebfe')

// Horas disponíveis (8:00 às 22:00) - base para todas as possibilidades
const horasBase = computed(() => {
  const horas = []
  for (let i = 8; i <= 22; i++) {
    const hora = i.toString().padStart(2, '0') + ':00'
    horas.push(hora)
  }
  return horas
})

// Horários disponíveis filtrados por conflitos
const horariosDisponiveis = computed(() => {
  if (!selectedData.value) {
    // Se não há data selecionada, mostrar todas as horas como disponíveis
    return horasBase.value.map(hora => ({
      hora,
      disponivel: true,
      conflito: false
    }))
  }

  // Usar o composable para obter horários disponíveis
  const horariosComValidacao = getHorariosDisponiveis(
    selectedData.value,
    props.agendamentos,
    horasBase.value,
    60, // 60 minutos por slot
    props.agendamentoId || undefined // Excluir o agendamento atual da validação
  )

  return horariosComValidacao.value
})

// Cliente selecionado
const clienteSelecionado = computed(() => {
  if (!selectedClienteId.value) return null
  return props.clientes.find(cliente => cliente.id === selectedClienteId.value) || null
})

// Cores disponíveis para seleção
const coresDisponiveis = ref([
  { value: '#deebfe', label: 'Azul Claro' },
  { value: '#dbeafe', label: 'Azul Muito Claro' },
  { value: '#bfdbfe', label: 'Azul Médio' },
  { value: '#dcfce7', label: 'Verde Claro' },
  { value: '#fef3c7', label: 'Amarelo Claro' },
  { value: '#fce7f3', label: 'Rosa Claro' },
  { value: '#f3e8ff', label: 'Roxo Claro' },
  { value: '#ecfeff', label: 'Ciano Claro' },
])

// Validação de conflito de horário em tempo real
const horarioTemConflito = computed(() => {
  // No modo de edição, não verificar conflitos de horário
  if (modoEdicao.value) {
    return false
  }

  if (!selectedData.value || !selectedHoraInicio.value || !selectedHoraFim.value) {
    return false
  }

  // Verificar se horário de início é anterior ao horário de fim
  if (!horarioValido(selectedHoraInicio.value, selectedHoraFim.value)) {
    return false // Deixar a validação específica para isso
  }

  return horarioConflitaComAgendamentos(
    selectedData.value,
    selectedHoraInicio.value,
    selectedHoraFim.value,
    props.agendamentos,
    props.agendamentoId || undefined // Excluir o agendamento atual da validação
  )
})

// Limpar/popular campos quando o modal abrir
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (modoEdicao.value && agendamentoAtual.value) {
      // Modo edição - popular campos com dados existentes
      const agendamento = agendamentoAtual.value
      selectedClienteId.value = agendamento.cliente_id
      selectedData.value = agendamento.data || ''
      selectedHoraInicio.value = agendamento.hora_inicio ? agendamento.hora_inicio.substring(0, 5) : ''
      selectedHoraFim.value = agendamento.hora_fim ? agendamento.hora_fim.substring(0, 5) : ''
      tituloAgendamento.value = agendamento.titulo || ''
      descricaoAgendamento.value = agendamento.descricao || ''
      selectedCor.value = agendamento.cor || '#deebfe'
    } else {
      // Modo criação - limpar campos
      selectedClienteId.value = null
      selectedData.value = ''
      selectedHoraInicio.value = ''
      selectedHoraFim.value = ''
      tituloAgendamento.value = ''
      descricaoAgendamento.value = ''
      selectedCor.value = '#deebfe'
    }
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
  // Validações básicas para título
  if (!tituloAgendamento.value.trim()) {
    modalError.value = 'Digite um título para o agendamento'
    return
  }

  // Validações específicas para criação (não aplicáveis na edição)
  if (!modoEdicao.value) {
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

    // Validar se horário de início é anterior ao horário de fim
    if (!horarioValido(selectedHoraInicio.value, selectedHoraFim.value)) {
      modalError.value = 'A hora de fim deve ser posterior à hora de início'
      return
    }

    // Validar conflitos com agendamentos existentes
    if (horarioTemConflito.value) {
      modalError.value = 'Este horário conflita com um agendamento existente'
      return
    }
  }

  try {
    modalError.value = null

    // Garantir que temos os dados necessários
    if (!props.userEspecialidade?.id) {
      modalError.value = 'Dados do profissional não disponíveis'
      return
    }

    emit('save', {
      clienteId: selectedClienteId.value || 0,
      profissionalId: props.userEspecialidade.id,
      data: selectedData.value,
      horaInicio: selectedHoraInicio.value,
      horaFim: selectedHoraFim.value,
      titulo: tituloAgendamento.value.trim(),
      descricao: descricaoAgendamento.value.trim() || null,
      cor: selectedCor.value
    })

  } catch (err: any) {
    modalError.value = err.message || 'Erro ao salvar agendamento'
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

// Função para cancelar agendamento
const handleCancelarAgendamento = async (event: Event) => {
  // Evitar propagação do evento para não fechar o modal
  event.preventDefault()
  event.stopPropagation()
  
  if (props.agendamentoId) {
    try {
      emit('cancelar-agendamento', props.agendamentoId)
      // O modal será fechado pelo componente pai após o cancelamento
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error)
      modalError.value = 'Erro ao cancelar agendamento. Tente novamente.'
    }
  }
}
</script>
/**
 * PROPÓSITO: Componente filho para exibir agendamentos completos em formato de cards
 * IMPORTA: inject('relatorioData')
 * USADO_POR: RelatorioContainer
 */

<template>
  <div class="p-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-gray-600">Carregando agendamentos...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <span class="text-red-800">Erro ao carregar agendamentos: {{ error }}</span>
      </div>
    </div>

    <!-- Cards List -->
    <div v-else-if="agendamentosCompletos.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div
        v-for="agendamento in agendamentosCompletos"
        :key="agendamento.id"
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative border-l-4"
        :style="{
          background: `linear-gradient(135deg, ${agendamento.cor || '#3B82F6'}25 0%, ${agendamento.cor || '#3B82F6'}05 100%)`,
          borderLeftColor: agendamento.cor || '#3B82F6'
        }"
      >
        <!-- Borda esquerda colorida para identificação visual -->
        <!-- Elemento decorativo removido para melhor legibilidade -->

        <div class="p-3 relative">
          <!-- Linha 1: Nome + Status + Profissional -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center flex-1 min-w-0">
              <div class="w-2 h-6 rounded-r-md mr-2 flex-shrink-0" :style="{ backgroundColor: agendamento.cor || '#3B82F6' }"></div>
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-bold text-gray-900 truncate">{{ agendamento.cliente.nome }}</h3>
                <p class="text-xs font-medium text-gray-800 truncate">{{ formatPhone(agendamento.cliente.telefone) }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 ml-4">
              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold flex-shrink-0"
                    :style="{
                      backgroundColor: agendamento.cancelado ? '#EF4444' : '#10B981',
                      color: '#FFFFFF'
                    }">
                {{ agendamento.cancelado ? 'Cancelado' : 'Ativo' }}
              </span>

              <div class="flex items-center flex-shrink-0">
                <div class="relative mr-2">
                  <div class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: agendamento.cor || '#3B82F6' }"></div>
                  <div class="absolute inset-0 w-3 h-3 rounded-full opacity-30 flex-shrink-0" :style="{ backgroundColor: agendamento.cor || '#3B82F6' }"></div>
                </div>
                <p class="text-xs font-bold text-gray-900 truncate max-w-20">{{ agendamento.profissional.nome }}</p>
              </div>
            </div>
          </div>

          <!-- Linha 2: Data + Horário + Título -->
          <div class="flex items-center justify-between gap-3">
            <!-- Data -->
            <div class="flex items-center flex-shrink-0 bg-gray-100 rounded-md px-2 py-1 shadow-sm border border-gray-300">
              <svg class="w-3 h-3 mr-1.5 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span class="text-xs font-semibold text-gray-800 whitespace-nowrap">{{ formatDateShort(agendamento.data) }}</span>
            </div>

            <!-- Horário -->
            <div class="flex items-center flex-shrink-0 bg-gray-100 rounded-md px-2 py-1 shadow-sm border border-gray-300">
              <svg class="w-3 h-3 mr-1.5 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-xs font-semibold text-gray-800 whitespace-nowrap">{{ formatTime(agendamento.hora_inicio) }}</span>
            </div>

            <!-- Título e Descrição (se existir) -->
            <div v-if="agendamento.titulo || agendamento.descricao" class="flex-1 min-w-0">
              <div class="bg-gray-100 rounded-md px-2 py-1 shadow-sm border border-gray-300">
                <div v-if="agendamento.titulo" class="flex items-center mb-1">
                  <div class="w-1 h-3 rounded-r-sm mr-2 flex-shrink-0" :style="{ backgroundColor: agendamento.cor || '#3B82F6' }"></div>
                  <p class="text-xs font-bold text-gray-900 truncate">{{ agendamento.titulo }}</p>
                </div>
                <div v-if="agendamento.descricao" class="text-xs font-medium text-gray-800 leading-tight">
                  {{ agendamento.descricao }}
                </div>
              </div>
            </div>

            <!-- Espaço vazio se não houver título nem descrição -->
            <div v-else class="flex-1"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum agendamento encontrado</h3>
      <p class="mt-1 text-sm text-gray-500">Não há agendamentos para exibir no momento.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar tipos
import type { AgendamentoCompleto } from '../stores/useRelatorioAgendamentosStore'

// Injetar dados do componente pai
const { agendamentosCompletos, loading, error, clientesAtivos, profissionaisAtivos, dataLoaded } = inject<{
  agendamentosCompletos: Ref<AgendamentoCompleto[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  clientesAtivos: Ref<any[]>
  profissionaisAtivos: Ref<any[]>
  dataLoaded: Ref<boolean>
}>('relatorioData')!

// Função para formatar data
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Função para formatar data curta (apenas dia/mês)
const formatDateShort = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  })
}

// Função para calcular luminância relativa
const getLuminance = (hex: string) => {
  const rgb = parseInt(hex.slice(1), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff

  const rsRGB = r / 255
  const gsRGB = g / 255
  const bsRGB = b / 255

  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

// Função para calcular contraste entre duas cores
const getContrastRatio = (color1: string, color2: string) => {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

// Função para determinar cor de texto com bom contraste
const getContrastingTextColor = (backgroundColor: string) => {
  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF')
  const blackContrast = getContrastRatio(backgroundColor, '#000000')

  // Retorna branco se o contraste com branco for melhor, senão preto
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000'
}

// Função para ajustar cor com opacidade para melhor contraste
const getAdjustedColor = (baseColor: string, backgroundColor: string) => {
  const contrast = getContrastRatio(baseColor, backgroundColor)

  // Se o contraste já for bom (>= 4.5), retorna a cor original
  if (contrast >= 4.5) {
    return baseColor
  }

  // Caso contrário, retorna branco ou preto baseado no contraste
  return getContrastingTextColor(backgroundColor)
}

// Função para formatar hora no padrão brasileiro
const formatTime = (timeString: string) => {
  // Se já estiver no formato HH:MM, retorna como está
  if (timeString.includes(':')) {
    return timeString.substring(0, 5) // Pega apenas HH:MM
  }
  // Caso contrário, assume que é uma string de tempo e formata
  return timeString
}

// Função para formatar telefone no padrão brasileiro
const formatPhone = (phoneString: string) => {
  if (!phoneString) return ''

  // Remove todos os caracteres não numéricos
  const cleaned = phoneString.replace(/\D/g, '')

  // Formatação para números brasileiros
  if (cleaned.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  } else if (cleaned.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 9) {
    // Celular sem DDD: XXXXX-XXXX
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
  } else if (cleaned.length === 8) {
    // Fixo sem DDD: XXXX-XXXX
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
  }

  // Retorna como está se não conseguir formatar
  return phoneString
}
</script>
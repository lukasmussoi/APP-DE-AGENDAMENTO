/**
 * PROPÓSITO: Componente de dropdown pesquisável reutilizável
 * IMPORTA: Nenhum
 * USADO_POR: NovoAgendamentoModal.vue e outros componentes que precisam de seleção pesquisável
 */

<template>
  <div class="relative">
    <!-- Campo de pesquisa -->
    <input
      :id="inputId"
      v-model="searchTerm"
      type="text"
      :placeholder="placeholder"
      class="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      @input="handleInput"
    />

    <!-- Dropdown de resultados -->
    <div
      v-if="showDropdown"
      class="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="item in filteredItems"
        :key="getItemKey(item)"
        @click="selectItem(item)"
        class="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
      >
        <div class="font-medium text-neutral-900">{{ getDisplayValue(item) }}</div>
        <div v-if="subtitleKey" class="text-sm text-neutral-600">{{ getSubtitleValue(item) }}</div>
      </div>

      <div v-if="filteredItems.length === 0 && searchTerm.trim()" class="px-3 py-2 text-sm text-neutral-500">
        Nenhum resultado encontrado
      </div>
    </div>

    <!-- Item selecionado -->
    <div v-if="selectedItem" class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
      <div class="flex items-center justify-between">
        <div>
          <div class="font-medium text-blue-900">{{ getDisplayValue(selectedItem) }}</div>
          <div v-if="subtitleKey" class="text-sm text-blue-700">{{ getSubtitleValue(selectedItem) }}</div>
        </div>
        <button
          @click="clearSelection"
          class="text-blue-600 hover:text-blue-800 p-1"
          type="button"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  items: any[]
  searchKey?: string | string[]
  displayKey?: string
  subtitleKey?: string
  placeholder?: string
  inputId?: string
  selectedItem?: any
  modelValue?: any
}

interface Emits {
  'update:modelValue': [value: any]
  'select': [item: any]
  'clear': []
}

const props = withDefaults(defineProps<Props>(), {
  searchKey: 'nome',
  displayKey: 'nome',
  subtitleKey: '',
  placeholder: 'Pesquisar...',
  inputId: '',
  selectedItem: null,
  modelValue: null
})

const emit = defineEmits<Emits>()

// Estado reativo
const searchTerm = ref('')
const showDropdown = ref(false)

// Computed para itens filtrados
const filteredItems = computed(() => {
  if (!searchTerm.value.trim()) return []

  const term = searchTerm.value.toLowerCase()
  const searchKeys = Array.isArray(props.searchKey) ? props.searchKey : [props.searchKey]

  return props.items.filter(item => {
    return searchKeys.some(key => {
      const value = getNestedValue(item, key)
      return value && value.toString().toLowerCase().includes(term)
    })
  })
})

// Função auxiliar para acessar valores aninhados
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Função para obter valor de display
const getDisplayValue = (item: any): string => {
  if (!item) return ''
  return getNestedValue(item, props.displayKey) || ''
}

// Função para obter valor de subtítulo
const getSubtitleValue = (item: any): string => {
  if (!item || !props.subtitleKey) return ''
  return getNestedValue(item, props.subtitleKey) || ''
}

// Função para obter chave única do item
const getItemKey = (item: any): string => {
  return item.id || item[props.displayKey] || JSON.stringify(item)
}

// Manipular input
const handleInput = () => {
  showDropdown.value = searchTerm.value.trim().length > 0 && filteredItems.value.length > 0
}

// Selecionar item
const selectItem = (item: any) => {
  emit('select', item)
  emit('update:modelValue', item)
  searchTerm.value = ''
  showDropdown.value = false
}

// Limpar seleção
const clearSelection = () => {
  emit('clear')
  emit('update:modelValue', null)
  searchTerm.value = ''
  showDropdown.value = false
}

// Atualizar searchTerm quando selectedItem muda
watch(() => props.selectedItem, (newItem) => {
  if (!newItem) {
    searchTerm.value = ''
  }
})

// Fechar dropdown quando clicar fora (opcional - pode ser implementado com diretiva)
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.searchable-dropdown')) {
      showDropdown.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
.searchable-dropdown {
  position: relative;
}
</style>
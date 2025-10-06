/**
 * PROPÓSITO: Componente avançado para transferir itens entre duas tabelas lado a lado
 * IMPORTA: DataTable, Button, Badge, Icon, composables de drag-drop
 * USADO_POR: Funcionalidades de atribuição, permissões, categorias, etc.
 */
<template>
  <div class="w-full">
    <!-- Header com controles -->
    <div v-if="title || showControls" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div class="flex-1">
        <h3 v-if="title" class="text-lg font-semibold text-neutral-900">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-neutral-600 mt-1">{{ subtitle }}</p>
      </div>

      <!-- Controles -->
      <div v-if="showControls" class="flex items-center gap-2">
        <Button
          v-if="sortable"
          size="sm"
          variant="outline"
          @click="toggleSort"
          :title="sortAscending ? 'Ordenar decrescente' : 'Ordenar crescente'"
        >
          <ArrowUpIcon v-if="sortAscending" class="w-4 h-4" />
          <ArrowDownIcon v-else class="w-4 h-4" />
        </Button>

        <Button
          v-if="allowComparison"
          size="sm"
          variant="outline"
          @click="toggleComparisonMode"
          :title="comparisonMode ? 'Modo normal' : 'Modo comparação'"
        >
          <EyeIcon class="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          @click="clearAll"
          :title="'Limpar tudo'"
        >
          <XMarkIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Modo de comparação -->
    <div v-if="comparisonMode" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center gap-2 text-blue-800">
        <EyeIcon class="w-5 h-5" />
        <span class="font-medium">Modo de Comparação</span>
      </div>
      <p class="text-sm text-blue-600 mt-1">
        Visualize as diferenças entre as listas disponíveis e selecionadas.
      </p>
    </div>

    <!-- Transfer Container -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
      <!-- Source Table -->
      <div class="lg:col-span-2">
        <div class="border border-neutral-200 rounded-lg bg-white">
          <!-- Header da tabela fonte -->
          <div class="p-4 border-b border-neutral-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-medium text-neutral-900">{{ sourceTitle }}</h4>
                <Badge variant="info" size="sm">
                  {{ filteredAvailableItems.length }}
                </Badge>
              </div>

              <!-- Filtro por categoria (se disponível) -->
              <div v-if="hasCategories && showCategoryFilter" class="flex items-center gap-2">
                <select
                  v-model="sourceCategoryFilter"
                  class="text-xs border border-neutral-300 rounded px-2 py-1"
                  @change="onCategoryFilterChange"
                >
                  <option value="">Todas</option>
                  <option
                    v-for="category in availableCategories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Busca -->
            <div v-if="searchable" class="mt-3">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  v-model="sourceSearchQuery"
                  type="text"
                  placeholder="Buscar..."
                  class="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm bg-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  @keydown="onSourceKeydown"
                />
              </div>
            </div>
          </div>

          <!-- Lista de itens -->
          <div class="max-h-80 overflow-y-auto">
            <div v-if="isLoadingSource" class="p-8 text-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              <p class="text-sm text-neutral-600 mt-2">Carregando...</p>
            </div>

            <div v-else-if="filteredAvailableItems.length === 0" class="p-8 text-center">
              <InboxIcon class="w-8 h-8 text-neutral-400 mx-auto" />
              <p class="text-sm text-neutral-500 mt-2">{{ sourceEmptyMessage }}</p>
            </div>

            <div v-else class="divide-y divide-neutral-100">
              <div
                v-for="(item, index) in paginatedAvailableItems"
                :key="getItemKey(item, index)"
                :class="[
                  'p-3 hover:bg-neutral-50 cursor-pointer transition-colors',
                  isItemSelected(item, selectedSourceItems) ? 'bg-primary-50 border-l-4 border-primary-500' : '',
                  dragOverItem === item.id ? 'bg-green-50' : ''
                ]"
                @click="onSourceItemClick(item)"
                @dblclick="moveItemToTarget(item)"
                @dragstart="onDragStart($event, item, 'source')"
                @dragover.prevent="onDragOver($event, String(item.id))"
                @dragleave="onDragLeave"
                @drop="onDrop($event, 'source')"
                draggable="true"
              >
                <div class="flex items-center gap-3">
                  <!-- Checkbox -->
                  <input
                    type="checkbox"
                    :checked="isItemSelected(item, selectedSourceItems)"
                    @change="onSourceItemSelect(item)"
                    class="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
                  />

                  <!-- Conteúdo do item -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-sm text-neutral-900 truncate">
                        {{ getItemDisplayName(item) }}
                      </span>
                      <Badge
                        v-if="getItemCategory(item)"
                        variant="neutral"
                        size="xs"
                      >
                        {{ getItemCategory(item) }}
                      </Badge>
                    </div>

                    <div v-if="showItemDetails && getItemDescription(item)" class="text-xs text-neutral-500 mt-1">
                      {{ getItemDescription(item) }}
                    </div>
                  </div>

                  <!-- Ações rápidas -->
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="xs"
                      variant="ghost"
                      @click.stop="moveItemToTarget(item)"
                      class="text-neutral-600 hover:text-primary-600 p-1"
                      :title="`Mover para ${targetTitle.toLowerCase()}`"
                    >
                      <ArrowRightIcon class="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginação simples -->
          <div v-if="showPagination && totalAvailablePages > 1" class="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
            <div class="flex items-center justify-between text-xs text-neutral-600">
              <span>{{ availableStart }}-{{ availableEnd }} de {{ filteredAvailableItems.length }}</span>
              <div class="flex items-center gap-1">
                <Button
                  size="xs"
                  variant="outline"
                  :disabled="availableCurrentPage === 1"
                  @click="availableCurrentPage--"
                >
                  <ChevronLeftIcon class="w-3 h-3" />
                </Button>
                <span class="px-2">{{ availableCurrentPage }}/{{ totalAvailablePages }}</span>
                <Button
                  size="xs"
                  variant="outline"
                  :disabled="availableCurrentPage === totalAvailablePages"
                  @click="availableCurrentPage++"
                >
                  <ChevronRightIcon class="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transfer Controls -->
      <div class="lg:col-span-1 flex flex-col items-center justify-center gap-3 px-4">
        <!-- Controles principais -->
        <div class="flex flex-col gap-2 w-full max-w-[120px]">
          <Button
            @click="moveSelectedToTarget"
            :disabled="selectedSourceItems.length === 0 || isTransferring"
            size="sm"
            class="w-full"
            :title="`Mover ${selectedSourceItems.length} item(ns) para ${targetTitle.toLowerCase()}`"
          >
            <ArrowRightIcon class="w-4 h-4" />
            <span class="sr-only">Mover para direita</span>
          </Button>

          <Button
            @click="moveAllToTarget"
            :disabled="filteredAvailableItems.length === 0 || isTransferring"
            variant="outline"
            size="sm"
            class="w-full"
            :title="`Mover todos para ${targetTitle.toLowerCase()}`"
          >
            <ChevronDoubleRightIcon class="w-4 h-4" />
            <span class="sr-only">Mover tudo para direita</span>
          </Button>
        </div>

        <!-- Separador -->
        <div class="w-full border-t border-neutral-200 my-2"></div>

        <!-- Controles inversos -->
        <div class="flex flex-col gap-2 w-full max-w-[120px]">
          <Button
            @click="moveSelectedToSource"
            :disabled="selectedTargetItems.length === 0 || isTransferring"
            size="sm"
            class="w-full"
            :title="`Mover ${selectedTargetItems.length} item(ns) para ${sourceTitle.toLowerCase()}`"
          >
            <ArrowLeftIcon class="w-4 h-4" />
            <span class="sr-only">Mover para esquerda</span>
          </Button>

          <Button
            @click="moveAllToSource"
            :disabled="selectedItems.length === 0 || isTransferring"
            variant="outline"
            size="sm"
            class="w-full"
            :title="`Mover todos para ${sourceTitle.toLowerCase()}`"
          >
            <ChevronDoubleLeftIcon class="w-4 h-4" />
            <span class="sr-only">Mover tudo para esquerda</span>
          </Button>
        </div>

        <!-- Indicador de progresso -->
        <div v-if="isTransferring" class="mt-4 text-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 mx-auto"></div>
          <p class="text-xs text-neutral-600 mt-1">Transferindo...</p>
        </div>
      </div>

      <!-- Target Table -->
      <div class="lg:col-span-2">
        <div class="border border-neutral-200 rounded-lg bg-white">
          <!-- Header da tabela destino -->
          <div class="p-4 border-b border-neutral-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-medium text-neutral-900">{{ targetTitle }}</h4>
                <Badge variant="success" size="sm">
                  {{ filteredSelectedItems.length }}
                </Badge>
              </div>

              <!-- Filtro por categoria (se disponível) -->
              <div v-if="hasCategories && showCategoryFilter" class="flex items-center gap-2">
                <select
                  v-model="targetCategoryFilter"
                  class="text-xs border border-neutral-300 rounded px-2 py-1"
                  @change="onCategoryFilterChange"
                >
                  <option value="">Todas</option>
                  <option
                    v-for="category in selectedCategories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Busca -->
            <div v-if="searchable" class="mt-3">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  v-model="targetSearchQuery"
                  type="text"
                  placeholder="Buscar..."
                  class="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-sm bg-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  @keydown="onTargetKeydown"
                />
              </div>
            </div>
          </div>

          <!-- Lista de itens -->
          <div class="max-h-80 overflow-y-auto">
            <div v-if="isLoadingTarget" class="p-8 text-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              <p class="text-sm text-neutral-600 mt-2">Carregando...</p>
            </div>

            <div v-else-if="filteredSelectedItems.length === 0" class="p-8 text-center">
              <InboxIcon class="w-8 h-8 text-neutral-400 mx-auto" />
              <p class="text-sm text-neutral-500 mt-2">{{ targetEmptyMessage }}</p>
            </div>

            <div v-else class="divide-y divide-neutral-100">
              <div
                v-for="(item, index) in paginatedSelectedItems"
                :key="getItemKey(item, index)"
                :class="[
                  'p-3 hover:bg-neutral-50 cursor-pointer transition-colors group',
                  isItemSelected(item, selectedTargetItems) ? 'bg-primary-50 border-l-4 border-primary-500' : '',
                  dragOverItem === item.id ? 'bg-green-50' : ''
                ]"
                @click="onTargetItemClick(item)"
                @dblclick="moveItemToSource(item)"
                @dragstart="onDragStart($event, item, 'target')"
                @dragover.prevent="onDragOver($event, item.id)"
                @dragleave="onDragLeave"
                @drop="onDrop($event, 'target')"
                draggable="true"
              >
                <div class="flex items-center gap-3">
                  <!-- Checkbox -->
                  <input
                    type="checkbox"
                    :checked="isItemSelected(item, selectedTargetItems)"
                    @change="onTargetItemSelect(item)"
                    class="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
                  />

                  <!-- Conteúdo do item -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-sm text-neutral-900 truncate">
                        {{ getItemDisplayName(item) }}
                      </span>
                      <Badge
                        v-if="getItemCategory(item)"
                        variant="neutral"
                        size="xs"
                      >
                        {{ getItemCategory(item) }}
                      </Badge>
                    </div>

                    <div v-if="showItemDetails && getItemDescription(item)" class="text-xs text-neutral-500 mt-1">
                      {{ getItemDescription(item) }}
                    </div>
                  </div>

                  <!-- Ações rápidas -->
                  <div class="flex items-center gap-1">
                    <Button
                      size="xs"
                      variant="ghost"
                      @click.stop="moveItemToSource(item)"
                      class="text-neutral-600 hover:text-error-600 p-1"
                      :title="`Remover ${getItemLabel(item)}`"
                    >
                      <XMarkIcon class="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginação simples -->
          <div v-if="showPagination && totalSelectedPages > 1" class="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
            <div class="flex items-center justify-between text-xs text-neutral-600">
              <span>{{ selectedStart }}-{{ selectedEnd }} de {{ filteredSelectedItems.length }}</span>
              <div class="flex items-center gap-1">
                <Button
                  size="xs"
                  variant="outline"
                  :disabled="selectedCurrentPage === 1"
                  @click="selectedCurrentPage--"
                >
                  <ChevronLeftIcon class="w-3 h-3" />
                </Button>
                <span class="px-2">{{ selectedCurrentPage }}/{{ totalSelectedPages }}</span>
                <Button
                  size="xs"
                  variant="outline"
                  :disabled="selectedCurrentPage === totalSelectedPages"
                  @click="selectedCurrentPage++"
                >
                  <ChevronRightIcon class="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer with summary and validation -->
    <div class="mt-6">
      <!-- Alertas de validação -->
      <div v-if="validationErrors.length > 0" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-2 text-red-800">
          <ExclamationTriangleIcon class="w-5 h-5" />
          <span class="font-medium">Atenção</span>
        </div>
        <ul class="text-sm text-red-700 mt-1 list-disc list-inside">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <!-- Resumo detalhado -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-neutral-600">
        <div class="flex items-center gap-6">
          <div>
            <span class="font-medium">{{ filteredAvailableItems.length }}</span>
            <span class="text-neutral-500"> disponível(is)</span>
          </div>
          <div>
            <span class="font-medium text-success-600">{{ filteredSelectedItems.length }}</span>
            <span class="text-neutral-500"> selecionado(s)</span>
          </div>
          <div v-if="maxItems">
            <span class="text-neutral-500">máx. </span>
            <span class="font-medium">{{ maxItems }}</span>
          </div>
        </div>

        <div v-if="showSummary" class="flex items-center gap-4">
          <slot name="summary" :available="filteredAvailableItems" :selected="filteredSelectedItems" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import DataTable from './DataTable.vue'
import Badge from './Badge.vue'
import Button from './Button.vue'
import type { TableColumn, TableItem } from './DataTable.vue'
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

interface Props {
  title?: string
  subtitle?: string
  sourceTitle?: string
  targetTitle?: string
  sourceColumns: TableColumn[]
  targetColumns: TableColumn[]
  allItems: TableItem[]
  selectedItems: TableItem[]
  searchable?: boolean
  loading?: boolean
  sourceEmptyMessage?: string
  targetEmptyMessage?: string
  showSummary?: boolean
  // Novos props para funcionalidades avançadas
  sortable?: boolean
  allowComparison?: boolean
  showControls?: boolean
  showCategoryFilter?: boolean
  showItemDetails?: boolean
  showPagination?: boolean
  itemsPerPage?: number
  maxItems?: number
  minItems?: number
  allowDuplicates?: boolean
  dragEnabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sourceTitle: 'Disponíveis',
  targetTitle: 'Selecionados',
  searchable: true,
  loading: false,
  sourceEmptyMessage: 'Nenhum item disponível',
  targetEmptyMessage: 'Nenhum item selecionado',
  showSummary: true,
  sortable: false,
  allowComparison: false,
  showControls: true,
  showCategoryFilter: true,
  showItemDetails: false,
  showPagination: false,
  itemsPerPage: 50,
  maxItems: undefined,
  minItems: 0,
  allowDuplicates: false,
  dragEnabled: true
})

const emit = defineEmits<{
  'update:selectedItems': [items: TableItem[]]
  'item-added': [item: TableItem]
  'item-removed': [item: TableItem]
  'items-changed': [selected: TableItem[], available: TableItem[]]
  'validation-error': [errors: string[]]
  'search': [query: string, side: 'source' | 'target']
  'sort': [direction: 'asc' | 'desc']
}>()

// Reactive data
const selectedSourceItems = ref<TableItem[]>([])
const selectedTargetItems = ref<TableItem[]>([])
const sourceSearchQuery = ref('')
const targetSearchQuery = ref('')
const sourceCategoryFilter = ref('')
const targetCategoryFilter = ref('')
const sortAscending = ref(true)
const comparisonMode = ref(false)
const isTransferring = ref(false)
const isLoadingSource = ref(false)
const isLoadingTarget = ref(false)
const availableCurrentPage = ref(1)
const selectedCurrentPage = ref(1)
const dragOverItem = ref<string | null>(null)
const draggedItem = ref<TableItem | null>(null)
const draggedFrom = ref<'source' | 'target' | null>(null)
const validationErrors = ref<string[]>([])

// Computed properties
const availableItems = computed(() => {
  const selectedIds = new Set(props.selectedItems.map(item => item.id))
  return props.allItems.filter(item => !selectedIds.has(item.id))
})

const hasCategories = computed(() => {
  return props.allItems.some(item => getItemCategory(item))
})

const availableCategories = computed(() => {
  const categories = new Set<string>()
  availableItems.value.forEach(item => {
    const category = getItemCategory(item)
    if (category) categories.add(category)
  })
  return Array.from(categories).sort()
})

const selectedCategories = computed(() => {
  const categories = new Set<string>()
  props.selectedItems.forEach(item => {
    const category = getItemCategory(item)
    if (category) categories.add(category)
  })
  return Array.from(categories).sort()
})

const filteredAvailableItems = computed(() => {
  let items = [...availableItems.value]

  // Filtro de busca
  if (sourceSearchQuery.value) {
    const query = sourceSearchQuery.value.toLowerCase()
    items = items.filter(item =>
      getItemDisplayName(item).toLowerCase().includes(query) ||
      getItemDescription(item)?.toLowerCase().includes(query)
    )
  }

  // Filtro de categoria
  if (sourceCategoryFilter.value) {
    items = items.filter(item => getItemCategory(item) === sourceCategoryFilter.value)
  }

  // Ordenação
  if (props.sortable) {
    items.sort((a, b) => {
      const aName = getItemDisplayName(a).toLowerCase()
      const bName = getItemDisplayName(b).toLowerCase()
      return sortAscending.value ? aName.localeCompare(bName) : bName.localeCompare(aName)
    })
  }

  return items
})

const filteredSelectedItems = computed(() => {
  let items = [...props.selectedItems]

  // Filtro de busca
  if (targetSearchQuery.value) {
    const query = targetSearchQuery.value.toLowerCase()
    items = items.filter(item =>
      getItemDisplayName(item).toLowerCase().includes(query) ||
      getItemDescription(item)?.toLowerCase().includes(query)
    )
  }

  // Filtro de categoria
  if (targetCategoryFilter.value) {
    items = items.filter(item => getItemCategory(item) === targetCategoryFilter.value)
  }

  // Ordenação
  if (props.sortable) {
    items.sort((a, b) => {
      const aName = getItemDisplayName(a).toLowerCase()
      const bName = getItemDisplayName(b).toLowerCase()
      return sortAscending.value ? aName.localeCompare(bName) : bName.localeCompare(aName)
    })
  }

  return items
})

const paginatedAvailableItems = computed(() => {
  if (!props.showPagination) return filteredAvailableItems.value

  const start = (availableCurrentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredAvailableItems.value.slice(start, end)
})

const paginatedSelectedItems = computed(() => {
  if (!props.showPagination) return filteredSelectedItems.value

  const start = (selectedCurrentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredSelectedItems.value.slice(start, end)
})

const totalAvailablePages = computed(() => Math.ceil(filteredAvailableItems.value.length / props.itemsPerPage))
const totalSelectedPages = computed(() => Math.ceil(filteredSelectedItems.value.length / props.itemsPerPage))

const availableStart = computed(() => (availableCurrentPage.value - 1) * props.itemsPerPage + 1)
const availableEnd = computed(() => Math.min(availableCurrentPage.value * props.itemsPerPage, filteredAvailableItems.value.length))
const selectedStart = computed(() => (selectedCurrentPage.value - 1) * props.itemsPerPage + 1)
const selectedEnd = computed(() => Math.min(selectedCurrentPage.value * props.itemsPerPage, filteredSelectedItems.value.length))

// Methods
function onSourceItemSelect(item: TableItem) {
  const index = selectedSourceItems.value.findIndex(i => i.id === item.id)
  if (index > -1) {
    selectedSourceItems.value.splice(index, 1)
  } else {
    selectedSourceItems.value.push(item)
  }
}

function onTargetItemSelect(item: TableItem) {
  const index = selectedTargetItems.value.findIndex(i => i.id === item.id)
  if (index > -1) {
    selectedTargetItems.value.splice(index, 1)
  } else {
    selectedTargetItems.value.push(item)
  }
}

function getItemLabel(item: TableItem): string {
  if (!item) return 'Item'
  return String(item.name || item.title || item.label || item.id || 'Item')
}

function getItemDisplayName(item: TableItem): string {
  if (!item) return 'Item'
  return String(item.name || item.title || item.label || item.id || 'Item')
}

function getItemDescription(item: TableItem): string | undefined {
  return item.description || item.subtitle || item.details
}

function getItemCategory(item: TableItem): string | undefined {
  return item.category || item.group || item.type
}

function isItemSelected(item: TableItem, selectedList: TableItem[]): boolean {
  return selectedList.some(selected => selected.id === item.id)
}

function validateSelection(): boolean {
  validationErrors.value = []

  if (props.minItems && props.selectedItems.length < props.minItems) {
    validationErrors.value.push(`Mínimo de ${props.minItems} item(ns) deve ser selecionado`)
  }

  if (props.maxItems && props.selectedItems.length > props.maxItems) {
    validationErrors.value.push(`Máximo de ${props.maxItems} item(ns) pode ser selecionado`)
  }

  emit('validation-error', validationErrors.value)
  return validationErrors.value.length === 0
}

function toggleSort() {
  sortAscending.value = !sortAscending.value
  emit('sort', sortAscending.value ? 'asc' : 'desc')
}

function toggleComparisonMode() {
  comparisonMode.value = !comparisonMode.value
}

function clearAll() {
  selectedSourceItems.value = []
  selectedTargetItems.value = []
  emit('update:selectedItems', [])
  emit('items-changed', [], availableItems.value)
}

function onCategoryFilterChange() {
  // Reset pagination when filter changes
  availableCurrentPage.value = 1
  selectedCurrentPage.value = 1
}

function onSourceKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    emit('search', sourceSearchQuery.value, 'source')
  } else if (event.ctrlKey && event.key === 'a') {
    event.preventDefault()
    selectedSourceItems.value = [...paginatedAvailableItems.value]
  }
}

function onTargetKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    emit('search', targetSearchQuery.value, 'target')
  } else if (event.ctrlKey && event.key === 'a') {
    event.preventDefault()
    selectedTargetItems.value = [...paginatedSelectedItems.value]
  } else if (event.key === 'Delete') {
    if (selectedTargetItems.value.length > 0) {
      moveSelectedToSource()
    }
  }
}

function onSourceItemClick(item: TableItem) {
  const index = selectedSourceItems.value.findIndex(i => i.id === item.id)
  if (index > -1) {
    selectedSourceItems.value.splice(index, 1)
  } else {
    if (!(event as any)?.ctrlKey) {
      selectedSourceItems.value = []
    }
    selectedSourceItems.value.push(item)
  }
}

function onTargetItemClick(item: TableItem) {
  const index = selectedTargetItems.value.findIndex(i => i.id === item.id)
  if (index > -1) {
    selectedTargetItems.value.splice(index, 1)
  } else {
    if (!(event as any)?.ctrlKey) {
      selectedTargetItems.value = []
    }
    selectedTargetItems.value.push(item)
  }
}

function moveItemToTarget(item: TableItem) {
  if (props.maxItems && props.selectedItems.length >= props.maxItems) {
    validationErrors.value = [`Limite máximo de ${props.maxItems} itens atingido`]
    return
  }

  const newSelected = [...props.selectedItems, item]
  selectedSourceItems.value = selectedSourceItems.value.filter(i => i.id !== item.id)
  emit('update:selectedItems', newSelected)
  emit('item-added', item)
  emit('items-changed', newSelected, availableItems.value)
  validateSelection()
}

function moveItemToSource(item: TableItem) {
  const newSelected = props.selectedItems.filter(i => i.id !== item.id)
  selectedTargetItems.value = selectedTargetItems.value.filter(i => i.id !== item.id)
  emit('update:selectedItems', newSelected)
  emit('item-removed', item)
  emit('items-changed', newSelected, availableItems.value)
  validateSelection()
}

async function moveSelectedToTarget() {
  if (selectedSourceItems.value.length === 0 || isTransferring.value) return

  if (props.maxItems && props.selectedItems.length + selectedSourceItems.value.length > props.maxItems) {
    validationErrors.value = [`Limite máximo de ${props.maxItems} itens seria excedido`]
    return
  }

  isTransferring.value = true
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300))

    const newSelected = [...props.selectedItems, ...selectedSourceItems.value]
    selectedSourceItems.value = []
    emit('update:selectedItems', newSelected)
    emit('items-changed', newSelected, availableItems.value)
    validateSelection()
  } finally {
    isTransferring.value = false
  }
}

async function moveAllToTarget() {
  if (filteredAvailableItems.value.length === 0 || isTransferring.value) return

  const itemsToAdd = props.maxItems
    ? filteredAvailableItems.value.slice(0, props.maxItems - props.selectedItems.length)
    : filteredAvailableItems.value

  if (itemsToAdd.length === 0) {
    validationErrors.value = [`Limite máximo de ${props.maxItems} itens atingido`]
    return
  }

  isTransferring.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    const newSelected = [...props.selectedItems, ...itemsToAdd]
    emit('update:selectedItems', newSelected)
    emit('items-changed', newSelected, [])
    validateSelection()
  } finally {
    isTransferring.value = false
  }
}

async function moveSelectedToSource() {
  if (selectedTargetItems.value.length === 0 || isTransferring.value) return

  isTransferring.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 300))

    const newSelected = props.selectedItems.filter(item =>
      !selectedTargetItems.value.some(selected => selected.id === item.id)
    )
    selectedTargetItems.value = []
    emit('update:selectedItems', newSelected)
    emit('items-changed', newSelected, availableItems.value)
    validateSelection()
  } finally {
    isTransferring.value = false
  }
}

async function moveAllToSource() {
  if (props.selectedItems.length === 0 || isTransferring.value) return

  isTransferring.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    emit('update:selectedItems', [])
    emit('items-changed', [], availableItems.value)
    validateSelection()
  } finally {
    isTransferring.value = false
  }
}

// Drag and Drop functionality
function onDragStart(event: DragEvent, item: TableItem, from: 'source' | 'target') {
  if (!props.dragEnabled) return

  draggedItem.value = item
  draggedFrom.value = from
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('text/plain', item.id?.toString() || '')
}

function onDragOver(event: DragEvent, itemId: string) {
  if (!props.dragEnabled) return

  dragOverItem.value = itemId
}

function onDragLeave() {
  dragOverItem.value = null
}

function onDrop(event: DragEvent, to: 'source' | 'target') {
  if (!props.dragEnabled || !draggedItem.value) return

  event.preventDefault()
  dragOverItem.value = null

  const item = draggedItem.value
  const from = draggedFrom.value

  if (from === to) return // Can't drop on same side

  if (from === 'source' && to === 'target') {
    moveItemToTarget(item)
  } else if (from === 'target' && to === 'source') {
    moveItemToSource(item)
  }

  draggedItem.value = null
  draggedFrom.value = null
}

// Watchers
watch(() => props.selectedItems, () => {
  validateSelection()
}, { immediate: true })

watch(() => props.allItems, () => {
  // Reset selections when items change
  selectedSourceItems.value = []
  selectedTargetItems.value = []
}, { deep: true })

// Initialize validation
nextTick(() => {
  validateSelection()
})
</script>
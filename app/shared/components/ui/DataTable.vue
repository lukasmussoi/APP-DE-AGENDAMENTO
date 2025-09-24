/**
 * PROPÓSITO: Tabela de dados avançada e reutilizável para sistemas de agendamento
 * IMPORTA: Table, TableHeader, TableBody, TableRow, TableCell, Button, Badge, Icon
 * USADO_POR: Páginas de listagem de agendamentos, clientes, etc.
 */
<template>
  <div class="w-full">
    <!-- Header com título, busca e ações -->
    <div v-if="title || searchable || $slots.actions" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <div class="flex-1">
        <h3 v-if="title" class="text-lg font-semibold text-neutral-900">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-neutral-600 mt-1">{{ subtitle }}</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Campo de busca -->
        <div v-if="searchable" class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-4 w-4 text-neutral-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar..."
            class="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
        </div>

        <!-- Ações -->
        <div v-if="$slots.actions" class="flex items-center gap-2">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <!-- Container da tabela com loading -->
    <div class="relative">
      <!-- Loading overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg"
      >
        <div class="flex items-center gap-2">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
          <span class="text-sm text-neutral-600">Carregando...</span>
        </div>
      </div>

      <div class="border border-neutral-200 rounded-lg overflow-hidden bg-white">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader
              :columns="visibleColumns"
              :sort-key="sortKey"
              :sort-direction="sortDirection"
              @sort="onSort"
            />

            <TableBody>
              <!-- Estado vazio -->
              <TableRow v-if="filteredItems.length === 0 && !loading">
                <TableCell :colspan="visibleColumns.length" class="text-center py-12">
                  <div class="flex flex-col items-center gap-3">
                    <InboxIcon class="w-12 h-12 text-neutral-400" />
                    <div>
                      <p class="text-neutral-500 font-medium">{{ emptyMessage }}</p>
                      <p v-if="searchQuery" class="text-sm text-neutral-400 mt-1">
                        Tente ajustar sua busca ou filtros
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>

              <!-- Linhas de dados -->
              <TableRow
                v-for="(item, index) in paginatedItems"
                :key="getItemKey(item, index)"
                :selected="selectedItems.includes(item)"
                :clickable="selectable || rowClickable"
                :class="getRowClass(item)"
                @click="onRowClick(item)"
              >
                <!-- Checkbox de seleção -->
                <TableCell v-if="selectable" class="w-4">
                  <input
                    type="checkbox"
                    :checked="selectedItems.includes(item)"
                    @change="onItemSelect(item)"
                    class="w-4 h-4 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                </TableCell>

                <!-- Colunas de dados -->
                <TableCell
                  v-for="column in visibleColumns"
                  :key="column.key"
                  :class="column.cellClass"
                >
                  <!-- Slot customizado ou valor padrão -->
                  <slot
                    :name="`column-${column.key}`"
                    :item="item"
                    :value="getItemValue(item, column.key)"
                    :column="column"
                  >
                    <!-- Renderização padrão baseada no tipo -->
                    <template v-if="column.type === 'badge'">
                      <Badge :variant="getBadgeVariant(item, column)">
                        {{ getItemValue(item, column.key) }}
                      </Badge>
                    </template>

                    <template v-else-if="column.type === 'date'">
                      <span :title="formatDateTime(getItemValue(item, column.key))">
                        {{ formatDate(getItemValue(item, column.key)) }}
                      </span>
                    </template>

                    <template v-else-if="column.type === 'datetime'">
                      <span :title="formatDateTime(getItemValue(item, column.key))">
                        {{ formatDateTime(getItemValue(item, column.key)) }}
                      </span>
                    </template>

                    <template v-else-if="column.type === 'currency'">
                      <span class="font-medium">
                        {{ formatCurrency(getItemValue(item, column.key)) }}
                      </span>
                    </template>

                    <template v-else-if="column.type === 'actions'">
                      <div class="flex items-center gap-1">
                        <slot name="actions" :item="item">
                          <Button
                            v-if="editable"
                            size="sm"
                            variant="ghost"
                            @click.stop="emit('edit', item)"
                            class="text-neutral-600 hover:text-primary-600"
                            :title="`Editar ${getItemLabel(item)}`"
                          >
                            <PencilIcon class="w-4 h-4" />
                          </Button>
                          <Button
                            v-if="deletable"
                            size="sm"
                            variant="ghost"
                            class="text-neutral-600 hover:text-error-600"
                            @click.stop="emit('delete', item)"
                            :title="`Excluir ${getItemLabel(item)}`"
                          >
                            <TrashIcon class="w-4 h-4" />
                          </Button>
                        </slot>
                      </div>
                    </template>

                    <template v-else>
                      <span :title="getItemValue(item, column.key)">
                        {{ truncateText(getItemValue(item, column.key), column.maxLength) }}
                      </span>
                    </template>
                  </slot>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>

    <!-- Footer com seleção e paginação -->
    <div v-if="showFooter" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
      <!-- Seleção -->
      <div v-if="selectable && selectedItems.length > 0" class="flex items-center gap-2">
        <span class="text-sm text-neutral-600">
          {{ selectedItems.length }} item(ns) selecionado(s)
        </span>
        <Button size="sm" variant="outline" @click="clearSelection">
          Limpar seleção
        </Button>
      </div>

      <!-- Paginação -->
      <div v-if="pagination && totalPages > 1" class="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          :title="'Página anterior'"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </Button>

        <div class="flex items-center gap-1">
          <Button
            v-for="page in visiblePages"
            :key="page"
            size="sm"
            :variant="page === currentPage ? 'solid' : 'outline'"
            @click="goToPage(page)"
            :disabled="page === -1"
            class="min-w-[2.5rem]"
          >
            <template v-if="page === -1">...</template>
            <template v-else>{{ page }}</template>
          </Button>
        </div>

        <Button
          size="sm"
          variant="outline"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          :title="'Próxima página'"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Resumo -->
    <div v-if="showSummary" class="text-sm text-neutral-600 mt-2">
      Mostrando {{ startItem }}-{{ endItem }} de {{ filteredItems.length }} resultado(s)
      <span v-if="searchQuery"> (filtrado(s) por "{{ searchQuery }}")</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Table from './Table.vue'
import TableHeader from './TableHeader.vue'
import TableBody from './TableBody.vue'
import TableRow from './TableRow.vue'
import TableCell from './TableCell.vue'
import Button from './Button.vue'
import Badge from './Badge.vue'
import {
  InboxIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  type?: 'text' | 'badge' | 'date' | 'datetime' | 'currency' | 'actions'
  class?: string
  cellClass?: string
  maxLength?: number
  badgeVariant?: (item: any) => 'success' | 'error' | 'warning' | 'info' | 'neutral'
}

export interface TableItem {
  id?: string | number
  [key: string]: any
}

interface Props {
  title?: string
  subtitle?: string
  columns: TableColumn[]
  items: TableItem[]
  selectable?: boolean
  selectedItems?: TableItem[]
  editable?: boolean
  deletable?: boolean
  searchable?: boolean
  loading?: boolean
  emptyMessage?: string
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  pagination?: boolean
  currentPage?: number
  itemsPerPage?: number
  totalItems?: number
  rowClickable?: boolean
  showFooter?: boolean
  showSummary?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selectedItems: () => [],
  editable: false,
  deletable: false,
  searchable: false,
  loading: false,
  emptyMessage: 'Nenhum item encontrado',
  sortKey: '',
  sortDirection: 'asc',
  pagination: false,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  rowClickable: false,
  showFooter: true,
  showSummary: true
})

const emit = defineEmits<{
  sort: [key: string]
  'row-click': [item: TableItem]
  'item-select': [item: TableItem]
  select: [items: TableItem[]]
  edit: [item: TableItem]
  delete: [item: TableItem]
  'page-change': [page: number]
}>()

// Reactive data
const searchQuery = ref('')

// Computed properties
const visibleColumns = computed(() => {
  if (props.selectable) {
    return [{ key: 'select', label: '', type: 'actions' as const }, ...props.columns]
  }
  return props.columns
})

const filteredItems = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.items
  }

  const query = searchQuery.value.toLowerCase()
  return props.items.filter(item =>
    props.columns.some(column => {
      const value = getItemValue(item, column.key)
      return String(value).toLowerCase().includes(query)
    })
  )
})

const paginatedItems = computed(() => {
  if (!props.pagination) {
    return filteredItems.value
  }

  const start = (props.currentPage - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredItems.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / props.itemsPerPage))
const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, filteredItems.value.length))

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5)
      pages.push(-1) // ellipsis
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push(-1) // ellipsis
      pages.push(total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1)
      pages.push(-1) // ellipsis
      pages.push(current - 1, current, current + 1)
      pages.push(-1) // ellipsis
      pages.push(total)
    }
  }

  return pages
})

// Methods
function getItemKey(item: TableItem, index: number): string {
  return item.id?.toString() || `item-${index}`
}

function getItemValue(item: TableItem, key: string): any {
  return item[key]
}

function getBadgeVariant(item: TableItem, column: TableColumn): 'success' | 'error' | 'warning' | 'info' | 'neutral' {
  if (column.badgeVariant) {
    return column.badgeVariant(item) as 'success' | 'error' | 'warning' | 'info' | 'neutral'
  }

  const value = getItemValue(item, column.key)?.toString().toLowerCase()
  switch (value) {
    case 'ativo':
    case 'confirmado':
    case 'aprovado':
      return 'success'
    case 'inativo':
    case 'cancelado':
    case 'rejeitado':
      return 'error'
    case 'pendente':
    case 'aguardando':
      return 'warning'
    default:
      return 'info'
  }
}

function formatDate(value: any): string {
  if (!value) return '-'
  try {
    return new Date(value).toLocaleDateString('pt-BR')
  } catch {
    return value
  }
}

function formatDateTime(value: any): string {
  if (!value) return '-'
  try {
    return new Date(value).toLocaleString('pt-BR')
  } catch {
    return value
  }
}

function formatCurrency(value: any): string {
  if (!value) return 'R$ 0,00'
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(value))
  } catch {
    return String(value)
  }
}

function truncateText(text: any, maxLength?: number): string {
  if (!text || !maxLength) return String(text || '')
  const str = String(text)
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
}

function getItemLabel(item: TableItem): string {
  if (!item) return 'Item'
  return String(item.name || item.title || item.label || item.id || 'Item')
}

function getRowClass(item: TableItem): string {
  // Pode ser personalizado baseado no item
  return ''
}

function clearSelection() {
  emit('select', [])
}

function onSort(key: string) {
  emit('sort', key)
}

function onRowClick(item: TableItem) {
  if (props.rowClickable) {
    emit('row-click', item)
  }
}

function onItemSelect(item: TableItem) {
  const isSelected = props.selectedItems.includes(item)
  let newSelection: TableItem[]

  if (isSelected) {
    newSelection = props.selectedItems.filter(selected => selected !== item)
  } else {
    newSelection = [...props.selectedItems, item]
  }

  emit('item-select', item)
  emit('select', newSelection)
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page)
  }
}
</script>
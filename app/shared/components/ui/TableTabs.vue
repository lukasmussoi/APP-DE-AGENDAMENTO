/**
 * PROPÓSITO: Componente de tabela com abas para organizar dados categorizados
 * IMPORTA: DataTable, Button
 * USADO_POR: Páginas que precisam organizar dados em categorias/abas
 */
<template>
  <div class="w-full">
    <!-- Header -->
    <div v-if="title" class="mb-6">
      <h3 class="text-lg font-semibold text-neutral-900">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-neutral-600 mt-1">{{ subtitle }}</p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-neutral-200 mb-6">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.key
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
          ]"
          :aria-current="activeTab === tab.key ? 'page' : undefined"
        >
          <component :is="tab.icon" v-if="tab.icon" class="w-4 h-4 mr-2 inline" />
          {{ tab.label }}
          <Badge
            v-if="tab.badge"
            :variant="tab.badgeVariant || 'info'"
            size="sm"
            class="ml-2"
          >
            {{ tab.badge }}
          </Badge>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="space-y-6">
      <slot :active-tab="activeTab" :active-tab-data="activeTabData">
        <!-- Default DataTable -->
        <DataTable
          v-if="activeTabData"
          :title="activeTabData.title"
          :columns="activeTabData.columns"
          :items="activeTabData.items"
          :searchable="activeTabData.searchable"
          :selectable="activeTabData.selectable"
          :editable="activeTabData.editable"
          :deletable="activeTabData.deletable"
          :pagination="activeTabData.pagination"
          :loading="activeTabData.loading"
          :empty-message="activeTabData.emptyMessage"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @row-click="$emit('row-click', $event)"
          @item-select="$emit('item-select', $event)"
          @sort="$emit('sort', $event)"
          @page-change="$emit('page-change', $event)"
        >
          <template #actions>
            <slot name="actions" :active-tab="activeTab" :active-tab-data="activeTabData" />
          </template>

          <template
            v-for="column in activeTabData.columns"
            :key="`column-${column.key}`"
            #[`column-${column.key}`]="slotProps"
          >
            <slot :name="`column-${column.key}`" v-bind="slotProps" />
          </template>
        </DataTable>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DataTable from './DataTable.vue'
import Badge from './Badge.vue'
import type { TableColumn, TableItem } from './DataTable.vue'

export interface TableTab {
  key: string
  label: string
  icon?: any
  badge?: string | number
  badgeVariant?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  title?: string
  columns: TableColumn[]
  items: TableItem[]
  searchable?: boolean
  selectable?: boolean
  editable?: boolean
  deletable?: boolean
  pagination?: boolean
  loading?: boolean
  emptyMessage?: string
}

interface Props {
  title?: string
  subtitle?: string
  tabs: TableTab[]
  defaultActiveTab?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultActiveTab: ''
})

const emit = defineEmits<{
  'tab-change': [tabKey: string]
  'row-click': [item: TableItem]
  'item-select': [item: TableItem]
  edit: [item: TableItem]
  delete: [item: TableItem]
  sort: [key: string]
  'page-change': [page: number]
}>()

// Reactive data
const activeTab = ref(props.defaultActiveTab || props.tabs[0]?.key || '')

// Computed properties
const activeTabData = computed(() => {
  return props.tabs.find(tab => tab.key === activeTab.value)
})

// Watch for tab changes
watch(activeTab, (newTab) => {
  emit('tab-change', newTab)
})
</script>
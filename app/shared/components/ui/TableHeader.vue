/**
 * PROPÓSITO: Cabeçalho da tabela com suporte a ordenação
 * IMPORTA: Nenhum
 * USADO_POR: DataTable
 */
<template>
  <thead class="text-xs text-neutral-700 uppercase bg-neutral-50">
    <tr>
      <th
        v-for="(column, index) in columns"
        :key="index"
        scope="col"
        class="px-6 py-3 font-medium"
        :class="column.class"
      >
        <div class="flex items-center gap-2">
          <span>{{ column.label }}</span>
          <button
            v-if="column.sortable"
            @click="onSort(column.key)"
            class="hover:text-primary-600 transition-colors"
          >
            <ChevronUpDownIcon class="w-4 h-4" />
          </button>
        </div>
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import { ChevronUpDownIcon } from '@heroicons/vue/24/outline'

interface Column {
  key: string
  label: string
  sortable?: boolean
  class?: string
}

interface Props {
  columns: Column[]
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  sortKey: '',
  sortDirection: 'asc'
})

const emit = defineEmits<{
  sort: [key: string]
}>()

function onSort(key: string) {
  emit('sort', key)
}
</script>
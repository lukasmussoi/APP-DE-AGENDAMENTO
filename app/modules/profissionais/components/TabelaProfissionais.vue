/**
 * PROPÓSITO: Componente para exibir tabela de profissionais
 * IMPORTA: Componentes UI de tabela, tipos de Profissional
 * USADO_POR: Página de profissionais
 */

<template>
  <Card>
    <template #header>
      <h2 class="text-lg font-semibold text-neutral-900">Lista de Profissionais</h2>
    </template>

    <!-- Estado de loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="text-neutral-500">Carregando profissionais...</div>
    </div>

    <!-- Estado de erro -->
    <div v-else-if="error" class="py-8 text-center text-red-600">
      <p>Erro ao carregar profissionais: {{ error }}</p>
      <Button @click="$emit('retry')" class="mt-4">
        Tentar Novamente
      </Button>
    </div>

    <!-- Estado vazio -->
    <div v-else-if="profissionais.length === 0" class="py-8 text-center text-neutral-500">
      <p>Nenhum profissional encontrado</p>
    </div>

    <!-- Tabela -->
    <div v-else class="overflow-x-auto">
      <Table>
        <TableHeader
          :columns="columns"
          :sort-key="sortKey"
          :sort-direction="sortDirection"
          @sort="handleSort"
        />
        <TableBody>
          <TableRow
            v-for="profissional in sortedProfissionais"
            :key="profissional.id"
            clickable
            @click="handleRowClick(profissional)"
          >
            <TableCell class="font-medium text-neutral-900">
              {{ profissional.id }}
            </TableCell>
            <TableCell class="font-mono text-sm">
              {{ profissional.profile_id }}
            </TableCell>
            <TableCell>
              {{ profissional.nome }}
            </TableCell>
            <TableCell>
              {{ profissional.especialidade }}
            </TableCell>
            <TableCell class="text-right" v-if="isAdmin">
              <div class="flex gap-2 justify-end">
                <Button 
                  size="sm" 
                  variant="outline"
                  @click.stop="$emit('edit', profissional)"
                >
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="danger"
                  @click.stop="$emit('delete', profissional)"
                >
                  Excluir
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <template #footer>
      <div class="flex justify-between items-center">
        <p class="text-sm text-neutral-500">
          Total: {{ profissionais.length }} profissional{{ profissionais.length !== 1 ? 'is' : '' }}
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { Profissional } from '../types/especialidade.types'

// Imports explícitos dos componentes UI
import Card from '../../../shared/components/ui/Card.vue'
import Button from '../../../shared/components/ui/Button.vue'
import Table from '../../../shared/components/ui/Table.vue'
import TableHeader from '../../../shared/components/ui/TableHeader.vue'
import TableBody from '../../../shared/components/ui/TableBody.vue'
import TableRow from '../../../shared/components/ui/TableRow.vue'
import TableCell from '../../../shared/components/ui/TableCell.vue'

// Props
const props = defineProps<{
  profissionais: Profissional[]
  loading: boolean
  error: string | null
  isAdmin?: boolean
}>()

// Emits
defineEmits<{
  retry: []
  edit: [profissional: Profissional]
  delete: [profissional: Profissional]
}>()

// Estado da tabela
const sortKey = ref<string>('id')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Configuração das colunas
const columns = computed(() => {
  const baseColumns = [
    { key: 'id', label: 'ID', sortable: true, class: 'w-20' },
    { key: 'profile_id', label: 'Prof ID', sortable: true, class: 'w-32' },
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'especialidade', label: 'Especialidade', sortable: true }
  ]

  // Só adiciona coluna de ações se for admin
  if (props.isAdmin) {
    baseColumns.push({ key: 'actions', label: 'Ações', sortable: false, class: 'w-40 text-right' })
  }

  return baseColumns
})

// Computed para profissionais ordenados
const sortedProfissionais = computed(() => {
  const sorted = [...props.profissionais]

  if (sortKey.value) {
    sorted.sort((a, b) => {
      const aValue = a[sortKey.value as keyof Profissional]
      const bValue = b[sortKey.value as keyof Profissional]

      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1

      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  }

  return sorted
})

// Handlers
const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const handleRowClick = (profissional: Profissional) => {
  console.log('Clicou no profissional:', profissional)
}
</script>
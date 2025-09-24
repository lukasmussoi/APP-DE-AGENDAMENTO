/**
 * PROPÓSITO: Tabela para listar especialidades
 * IMPORTA: Componentes UI reutilizáveis, composable useProfissionais
 * USADO_POR: Página de especialidades
 */

<template>
  <Card>
    <template #header>
      <h2 class="text-lg font-semibold text-neutral-900">Lista de Especialidades</h2>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="text-neutral-500">Carregando especialidades...</div>
    </div>

    <div v-else-if="error" class="py-8 text-center text-red-600">
      <p>Erro ao carregar especialidades: {{ error }}</p>
      <Button @click="fetchEspecialidades" class="mt-4">
        Tentar Novamente
      </Button>
    </div>

    <div v-else-if="especialidades.length === 0" class="py-8 text-center text-neutral-500">
      <p>Nenhuma especialidade encontrada</p>
    </div>

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
            v-for="especialidade in sortedEspecialidades" 
            :key="especialidade.id"
            clickable
            @click="handleRowClick(especialidade)"
          >
            <TableCell class="font-medium text-neutral-900">
              {{ especialidade.id }}
            </TableCell>
            <TableCell>
              {{ especialidade.especialidade }}
            </TableCell>
            <TableCell class="text-right">
              <div class="flex gap-2 justify-end">
                <Button 
                  size="sm" 
                  variant="outline"
                  @click.stop="editEspecialidade(especialidade)"
                >
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="danger"
                  @click.stop="deleteEspecialidade(especialidade)"
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
          Total: {{ especialidades.length }} especialidade{{ especialidades.length !== 1 ? 's' : '' }}
        </p>
        <Button @click="addEspecialidade">
          Nova Especialidade
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { Especialidade } from '../types/especialidade.types'
import { useProfissionais } from '../composables/profissionais'

// Imports explícitos dos componentes UI
import Card from '../../../shared/components/ui/Card.vue'
import Button from '../../../shared/components/ui/Button.vue'
import Table from '../../../shared/components/ui/Table.vue'
import TableHeader from '../../../shared/components/ui/TableHeader.vue'
import TableBody from '../../../shared/components/ui/TableBody.vue'
import TableRow from '../../../shared/components/ui/TableRow.vue'
import TableCell from '../../../shared/components/ui/TableCell.vue'

// Composable
const { especialidades, loading, error, fetchEspecialidades } = useProfissionais()

// Estado da tabela
const sortKey = ref<string>('id')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Configuração das colunas
const columns = [
  { key: 'id', label: 'ID', sortable: true, class: 'w-20' },
  { key: 'especialidade', label: 'Especialidade', sortable: true },
  { key: 'actions', label: 'Ações', sortable: false, class: 'w-40 text-right' }
]

// Computed para especialidades ordenadas
const sortedEspecialidades = computed(() => {
  const sorted = [...especialidades.value]
  
  if (sortKey.value) {
    sorted.sort((a, b) => {
      const aValue = a[sortKey.value as keyof Especialidade]
      const bValue = b[sortKey.value as keyof Especialidade]
      
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

const handleRowClick = (especialidade: Especialidade) => {
  console.log('Clicou na especialidade:', especialidade)
}

const editEspecialidade = (especialidade: Especialidade) => {
  console.log('Editar especialidade:', especialidade)
}

const deleteEspecialidade = (especialidade: Especialidade) => {
  console.log('Excluir especialidade:', especialidade)
}

const addEspecialidade = () => {
  console.log('Adicionar nova especialidade')
}

// Carregar dados ao montar o componente
onMounted(() => {
  fetchEspecialidades()
})
</script>
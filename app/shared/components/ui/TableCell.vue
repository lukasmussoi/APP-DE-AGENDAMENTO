/**
 * PROPÓSITO: Célula da tabela com alinhamento flexível
 * IMPORTA: Nenhum
 * USADO_POR: DataTable
 */
<template>
  <td class="px-6 py-4" :class="class">
    <slot />
  </td>
</template>

<script setup lang="ts">
interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: ''
})
</script>
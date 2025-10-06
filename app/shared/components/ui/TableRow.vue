/**
 * PROPÓSITO: Linha da tabela com suporte a hover e seleção
 * IMPORTA: Nenhum
 * USADO_POR: DataTable
 */
<template>
  <tr
    class="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
    :class="{
      'bg-primary-50': selected,
      'cursor-pointer': clickable
    }"
    @click="clickable && emit('click')"
  >
    <slot />
  </tr>
</template>

<script setup lang="ts">
interface Props {
  selected?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  clickable: false
})

const emit = defineEmits<{
  click: []
}>()
</script>
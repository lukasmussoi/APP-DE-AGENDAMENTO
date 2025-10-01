/**
 * PROPÓSITO: Componente reutilizável para seleção de cores
 * IMPORTA: Nenhum
 * USADO_POR: NovoAgendamentoModal
 */

<template>
  <div class="relative inline-block" ref="container">
    <button
      @click="toggleColorPicker"
      class="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      :style="{ backgroundColor: modelValue }"
      :title="getCorLabel(modelValue)"
    ></button>
    <Teleport to="body">
      <div
        v-show="showColorPicker"
        class="fixed z-[9999] w-48 bg-white border border-gray-300 rounded-md shadow-lg"
        :style="dropdownStyle"
      >
        <div class="p-2 grid grid-cols-4 gap-2">
          <button
            v-for="cor in cores"
            :key="cor.value"
            @click="selecionarCor(cor.value)"
            class="flex flex-col items-center space-y-1 p-2 rounded-md hover:bg-gray-50 transition-colors"
            :title="cor.label"
          >
            <div
              class="w-6 h-6 rounded-full border border-gray-300"
              :style="{ backgroundColor: cor.value }"
            ></div>
            <span class="text-xs text-gray-600">{{ cor.label }}</span>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
interface Cor {
  value: string
  label: string
}

interface Props {
  modelValue: string
  cores: Cor[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const container = ref<HTMLElement>()
const showColorPicker = ref(false)

const toggleColorPicker = () => {
  showColorPicker.value = !showColorPicker.value
}

const selecionarCor = (cor: string) => {
  emit('update:modelValue', cor)
  showColorPicker.value = false
}

const getCorLabel = (cor: string) => {
  return props.cores.find(c => c.value === cor)?.label || 'Azul Claro'
}

// Calcular posição do dropdown para teleport
const dropdownStyle = computed(() => {
  if (!container.value || !showColorPicker.value) return { display: 'none' }
  
  const rect = container.value.getBoundingClientRect()
  return {
    top: rect.bottom + 8 + 'px',
    left: rect.left + 'px'
  }
})

// Fechar dropdown ao clicar fora
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    if (container.value && !container.value.contains(event.target as Node)) {
      showColorPicker.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
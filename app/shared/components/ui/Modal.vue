/**
 * PROPÓSITO: Modal base reutilizável com header, conteúdo e footer
 * IMPORTA: Button, Icon componentes, Heroicons, Tailwind classes
 * USADO_POR: Componentes que precisam de modais (formulários, confirmações, etc.)
 */
<template>
  <!-- Modal Overlay -->
  <Teleport to="#teleports">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="handleBackdropClick"
        />

        <!-- Modal container -->
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="modelValue"
              :class="[
                'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all',
                'w-full sm:my-8 sm:max-w-lg',
                sizeClasses
              ]"
            >
              <!-- Header -->
              <div
                v-if="$slots.header || title"
                class="flex items-center justify-between px-6 py-4 border-b border-neutral-200"
              >
                <div class="flex items-center space-x-3">
                  <slot name="header">
                    <h3 id="modal-title" class="text-lg font-medium text-neutral-900">
                      {{ title }}
                    </h3>
                  </slot>
                </div>
                
                <!-- Close button -->
                <Button
                  v-if="showCloseButton"
                  variant="ghost"
                  size="sm"
                  @click="handleClose"
                  class="!p-2 hover:bg-neutral-100"
                >
                  <XMarkIcon class="w-5 h-5 text-neutral-400" />
                </Button>
              </div>

              <!-- Content -->
              <div :class="['px-6 py-4', contentClass]">
                <slot />
              </div>

              <!-- Footer -->
              <div
                v-if="$slots.footer || showDefaultFooter"
                class="flex justify-end space-x-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50"
              >
                <slot name="footer">
                  <!-- Default footer buttons -->
                  <Button
                    v-if="showDefaultFooter"
                    variant="outline"
                    @click="handleCancel"
                    :disabled="loading"
                  >
                    {{ cancelText }}
                  </Button>
                  <Button
                    v-if="showDefaultFooter"
                    variant="solid"
                    @click="handleConfirm"
                    :disabled="loading"
                  >
                    {{ confirmText }}
                  </Button>
                </slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import Button from './Button.vue'

interface ModalProps {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  showDefaultFooter?: boolean
  confirmText?: string
  cancelText?: string
  closableBackdrop?: boolean
  loading?: boolean
  contentClass?: string
  isEdicao?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  title: '',
  size: 'md',
  showCloseButton: true,
  showDefaultFooter: true,
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  closableBackdrop: true,
  loading: false,
  contentClass: '',
  isEdicao: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'confirm': []
  'cancel': []
}>()

// Computed classes for different sizes
const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-full sm:mx-4'
  }
  return sizes[props.size]
})

// Handlers
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closableBackdrop) {
    handleClose()
  }
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

// Prevent body scroll when modal is open
watch(() => props.modelValue, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

// Handle ESC key
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.modelValue) {
      handleClose()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
/* Modal utiliza o sistema de z-index padrão do Tailwind CSS */
/* z-50 garante que o modal apareça sobre a maioria dos elementos */
/* A sidebar está em z-10, então z-50 é mais que suficiente */
</style>
/**
 * PROPÓSITO: Gerenciar modais globalmente para evitar conflitos entre múltiplos modais
 * IMPORTA: Vue composables
 * USADO_POR: Modal.vue para controlar body scroll e ESC key
 */

// Estado global compartilhado entre todas as instâncias de modal
const modalStack = ref<string[]>([])
const bodyOverflowOriginal = ref<string>('')

export const useModalManager = () => {
  
  const registerModal = (id: string) => {
    if (!modalStack.value.includes(id)) {
      modalStack.value.push(id)
      
      // Se é o primeiro modal, salva o overflow original e bloqueia scroll
      if (modalStack.value.length === 1 && typeof document !== 'undefined') {
        bodyOverflowOriginal.value = document.body.style.overflow || ''
        document.body.style.overflow = 'hidden'
      }
    }
  }

  const unregisterModal = (id: string) => {
    const index = modalStack.value.indexOf(id)
    if (index > -1) {
      modalStack.value.splice(index, 1)
      
      // Se não há mais modais abertos, restaura o overflow original
      if (modalStack.value.length === 0 && typeof document !== 'undefined') {
        document.body.style.overflow = bodyOverflowOriginal.value
      }
    }
  }

  const isTopModal = (id: string): boolean => {
    return modalStack.value[modalStack.value.length - 1] === id
  }

  const getTopModalId = (): string | undefined => {
    return modalStack.value[modalStack.value.length - 1]
  }

  const hasActiveModals = (): boolean => {
    return modalStack.value.length > 0
  }

  // Limpar tudo em caso de necessidade (cleanup de emergência)
  const clearAllModals = () => {
    modalStack.value = []
    if (typeof document !== 'undefined') {
      document.body.style.overflow = bodyOverflowOriginal.value
    }
  }

  return {
    registerModal,
    unregisterModal,
    isTopModal,
    getTopModalId,
    hasActiveModals,
    clearAllModals,
    modalCount: computed(() => modalStack.value.length)
  }
}
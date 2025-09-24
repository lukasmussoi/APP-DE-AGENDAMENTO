/**
 * PROPÓSITO: Plugin para configurar vue3-toastify no Nuxt
 * IMPORTA: vue3-toastify
 * USADO_POR: Aplicação global
 */
import { defineNuxtPlugin } from '#app'
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 3000,
    position: 'top-right',
    theme: 'light',
    transition: 'slide',
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })

  // Expor toast globalmente
  return {
    provide: {
      toast
    }
  }
})
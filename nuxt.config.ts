// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@pinia/nuxt'
  ],
  
  // Configuração Tailwind para usar nosso arquivo CSS
  tailwindcss: {
    cssPath: '~/app/assets/css/main.css',
    configPath: 'tailwind.config.ts'
  },
  
  // Otimizações de renderização para evitar FOUC
  ssr: true,
  
  // Auto-imports configurados para estrutura modular
  imports: {
    dirs: [
      'shared/composables/**',
      'shared/utils/**',
      'app/shared/composables/**',
      'app/shared/utils/**',
      'app/shared/stores/**',
      'app/modules/*/composables',
      'app/modules/*/utils'
    ]
  },
  
  // Auto-import de componentes - paths corrigidos
  components: [
    '~/shared/components',
    {
      path: '~/shared/components/**',
      pathPrefix: false
    },
    {
      path: '~/app/modules/*/components',
      pathPrefix: false
    }
  ]
})
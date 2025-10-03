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
      'app/shared/composables/**',
      'app/shared/stores/**',
      'app/modules/*/composables'
    ]
  },
  
  // Auto-import de componentes - paths corrigidos
  components: [
    '~/app/shared/components/**',
    '~/app/modules/*/components/**'
  ],

  // Configuração do Supabase para permitir páginas públicas
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/',
      exclude: ['/esqueci-senha', '/login']
    }
  }
})
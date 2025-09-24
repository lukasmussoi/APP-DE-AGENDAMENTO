/**
 * PROPÓSITO: Footer da aplicação
 * IMPORTA: Vue 3
 * USADO_POR: Layout principal da aplicação
 */

<template>
  <footer class="bg-gray-50 border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">A</span>
            </div>
            <span class="text-xl font-semibold text-gray-900">Agendamento</span>
          </div>
          <p class="text-gray-600 mb-4">
            Sistema completo de agendamento para sua empresa. 
            Gerencie compromissos, clientes e muito mais.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Instagram</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.85 14.81 3.85 12.455 3.85 12.455s0-2.355 1.276-3.236c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c1.276.881 1.276 3.236 1.276 3.236s0 2.355-1.276 3.236c-.875.807-2.026 1.297-3.323 1.297zm7.74 0c-1.297 0-2.448-.49-3.323-1.297-1.276-.881-1.276-3.236-1.276-3.236s0-2.355 1.276-3.236c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c1.276.881 1.276 3.236 1.276 3.236s0 2.355-1.276 3.236c-.875.807-2.026 1.297-3.323 1.297z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
            Navegação
          </h3>
          <ul class="space-y-4">
            <li>
              <NuxtLink to="/" class="text-base text-gray-600 hover:text-gray-900">
                Início
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/agendamentos" class="text-base text-gray-600 hover:text-gray-900">
                Agendamentos
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/clientes" class="text-base text-gray-600 hover:text-gray-900">
                Clientes
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
            Suporte
          </h3>
          <ul class="space-y-4">
            <li>
              <a href="#" class="text-base text-gray-600 hover:text-gray-900">
                Central de Ajuda
              </a>
            </li>
            <li>
              <a href="#" class="text-base text-gray-600 hover:text-gray-900">
                Contato
              </a>
            </li>
            <li>
              <a href="#" class="text-base text-gray-600 hover:text-gray-900">
                Documentação
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-base text-gray-400">
          © {{ currentYear }} Agendamento App. Todos os direitos reservados.
        </p>
        <div class="mt-4 md:mt-0 flex space-x-6">
          <a href="#" class="text-gray-400 hover:text-gray-500">
            Termos de Uso
          </a>
          <a href="#" class="text-gray-400 hover:text-gray-500">
            Política de Privacidade
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
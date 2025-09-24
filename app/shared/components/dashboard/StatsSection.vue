/**
 * PROPÓSITO: Seção de estatísticas do dashboard
 * IMPORTA: Composables de dashboard, componentes UI
 * USADO_POR: Página inicial para exibir métricas principais
 */

<template>
  <section class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Dashboard
        </h2>
        <p class="text-gray-600">
          Visão geral dos seus agendamentos e clientes
        </p>
      </div>

      <div v-if="stats.loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="bg-white overflow-hidden shadow rounded-lg animate-pulse">
          <div class="p-5">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <div v-else-if="stats.error" class="text-center py-8">
        <div class="text-red-600 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-red-600 font-medium mb-4">{{ stats.error }}</p>
        <Button @click="refreshStats" variant="outline">
          Tentar Novamente
        </Button>
      </div>

      <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total de Agendamentos -->
        <Card class="hover:shadow-lg transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total de Agendamentos
                </dt>
                <dd class="text-2xl font-bold text-gray-900">
                  {{ stats.totalAgendamentos }}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <!-- Agendamentos Hoje -->
        <Card class="hover:shadow-lg transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Agendamentos Hoje
                </dt>
                <dd class="text-2xl font-bold text-gray-900">
                  {{ stats.agendamentosHoje }}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <!-- Total de Clientes -->
        <Card class="hover:shadow-lg transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total de Clientes
                </dt>
                <dd class="text-2xl font-bold text-gray-900">
                  {{ stats.totalClientes }}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <!-- Clientes Ativos -->
        <Card class="hover:shadow-lg transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Clientes Ativos
                </dt>
                <dd class="text-2xl font-bold text-gray-900">
                  {{ stats.clientesAtivos }}
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { stats, refreshStats } = useDashboardStats()
</script>
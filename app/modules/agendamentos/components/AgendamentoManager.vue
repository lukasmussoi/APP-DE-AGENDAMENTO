/**
 * PROPÓSITO: Componente principal para gerenciamento de agendamentos
 * IMPORTA: SemanaController
 * USADO_POR: Página de agendamentos
 */

<template>
  <div class="w-full min-h-screen flex flex-col">
    <!-- Header - parte superior -->
    <div class="topo h-24 bg-gray-50 border-b border-gray-200 flex items-center px-6">
      <!-- Controlador de semana no lado esquerdo -->
      <div class="flex-1">
        <SemanaController />
      </div>

      <!-- Espaço para outros controles no lado direito -->
      <div class="flex-1 flex justify-end">
        <!-- Outros controles podem ser adicionados aqui -->
      </div>
    </div>

    <!-- Corpo - parte inferior que ocupa o restante -->
    <div class="corpo flex-1">
      <!-- Corpo do gerenciador de agendamentos -->
    </div>
  </div>
</template>

<script setup lang="ts">
// Importar componente controlador de semana
import SemanaController from './SemanaController.vue'
</script>
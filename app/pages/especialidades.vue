/**
 * PROPÓSITO: Página de especialidades
 * IMPORTA: EspecialidadesTable
 * USADO_POR: Rota /especialidades
 */

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-neutral-900">Especialidades</h1>
      <p class="text-neutral-600 mt-1">Gerencie as especialidades do sistema</p>
    </div>
    
    <EspecialidadesTable />
  </div>
</template>

<script setup lang="ts">
import EspecialidadesTable from '../modules/profissionais/components/EspecialidadesTable.vue'

// Layout é aplicado automaticamente pelo Nuxt 4
</script>
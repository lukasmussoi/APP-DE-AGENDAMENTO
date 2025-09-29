/**
 * PROPÓSITO: Página de clientes
 * IMPORTA: TabelaClientes
 * USADO_POR: Rota /clientes
 */

<template>
  <div class="container mx-auto px-4 py-8">
    <TabelaClientes />
  </div>
</template>

<script setup lang="ts">
// Vinculação ao módulo clientes
import TabelaClientes from '@/modules/clientes/components/TabelaClientes.vue'

// Layout é aplicado automaticamente pelo Nuxt 4
</script>
/**
 * PROPÓSITO: Página de profissionais
 * IMPORTA: Composable useProfissionais, componente TabelaProfissionais
 * USADO_POR: Rota /profissionais
 */

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Profissionais</h1>

    <TabelaProfissionais
      :profissionais="profissionais"
      :loading="loading"
      :error="error"
      @retry="fetchProfissionais"
    />
  </div>
</template>

<script setup lang="ts">
import { useProfissionais } from '../modules/profissionais/composables/profissionais'
import TabelaProfissionais from '../modules/profissionais/components/TabelaProfissionais.vue'

// Usar o composable
const { profissionais, loading, error, fetchProfissionais } = useProfissionais()

// Buscar dados ao montar a página
onMounted(() => {
  fetchProfissionais()
})
</script>
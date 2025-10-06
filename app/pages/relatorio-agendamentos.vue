/**
 * PROPÓSITO: Página de relatório de agendamentos
 * IMPORTA: RelatorioContainer
 * USADO_POR: Rota /relatorio-agendamentos
 */

<template>
  <RelatorioContainer>
    <RelatorioCards />
  </RelatorioContainer>
</template>

<script setup lang="ts">
// Importar componentes
import RelatorioContainer from '../modules/agendamentos/components/RelatorioContainer.vue'
import RelatorioCards from '../modules/agendamentos/components/RelatorioCards.vue'
</script>
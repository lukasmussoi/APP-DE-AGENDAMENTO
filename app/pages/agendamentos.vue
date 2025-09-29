/**
 * PROPÓSITO: Página de agendamentos
 * IMPORTA: AgendamentoManager do módulo agendamentos, useAgendamentoStore para inicialização
 * USADO_POR: Rota /agendamentos
 */

<template>
  <AgendamentoManager />
</template>

<script setup lang="ts">
// Importar componente do módulo agendamentos
import { AgendamentoManager } from '../modules/agendamentos'

// Importar e inicializar store de agendamentos
import { useAgendamentoStore } from '../modules/agendamentos'

// Inicializar store quando a página montar
const agendamentoStore = useAgendamentoStore()

// O componente ocupa todo o espaço da página
</script>
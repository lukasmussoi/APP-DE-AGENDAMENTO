/**
 * PROPÓSITO: Shell principal da aplicação
 * IMPORTA: NuxtLayout, NuxtPage
 * USADO_POR: Automaticamente pelo Nuxt como root da aplicação
 */

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from './components/layout/MainLayout.vue';

const route = useRoute();

// Usa o layout principal a menos que a rota especifique que é "empty" (como a tela de login)
const isMainLayout = computed(() => route.meta.layout !== 'empty');
// Você pode adicionar títulos dinâmicos via route.meta futuramente
const title = computed(() => (route.meta.title as string) || 'Dashboard');
</script>

<template>
  <MainLayout v-if="isMainLayout" :title="title">
    <router-view />
  </MainLayout>
  <router-view v-else />
</template>

<script setup lang="ts">
import { Eye } from 'lucide-vue-next';

defineProps<{
  to?: string | object;
}>();
</script>

<template>
  <RouterLink 
    v-if="to"
    :to="to" 
    class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    title="Visualizar"
  >
    <Eye class="w-4 h-4" stroke-width="2.5" />
  </RouterLink>
  <button 
    v-else
    class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    title="Visualizar"
  >
    <Eye class="w-4 h-4" stroke-width="2.5" />
  </button>
</template>

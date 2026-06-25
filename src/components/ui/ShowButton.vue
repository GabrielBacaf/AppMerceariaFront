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
    class="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    title="Visualizar"
  >
    <Eye class="w-4 h-4" />
  </RouterLink>
  <button 
    v-else
    class="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    title="Visualizar"
  >
    <Eye class="w-4 h-4" />
  </button>
</template>

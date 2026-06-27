<script setup lang="ts">
import { PackagePlus } from 'lucide-vue-next';

defineProps<{
  to?: string | object;
}>();
</script>

<template>
  <RouterLink 
    v-if="to"
    :to="to" 
    class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-green-500 bg-green-500 text-white hover:bg-green-600 hover:border-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
    title="Dar entrada no estoque"
  >
    <PackagePlus class="w-4 h-4" stroke-width="2.5" />
  </RouterLink>
  <button 
    v-else
    class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-green-500 bg-green-500 text-white hover:bg-green-600 hover:border-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
    title="Dar entrada no estoque"
  >
    <PackagePlus class="w-4 h-4" stroke-width="2.5" />
  </button>
</template>

<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';

defineProps<{
  to?: string | object;
}>();
</script>

<template>
  <RouterLink 
    v-if="to"
    :to="to" 
    class="inline-flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
    title="Editar"
  >
    <Pencil class="w-4 h-4" />
  </RouterLink>
  <button 
    v-else
    class="inline-flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
    title="Editar"
  >
    <Pencil class="w-4 h-4" />
  </button>
</template>

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
    class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
    title="Editar"
  >
    <Pencil class="w-4 h-4" stroke-width="2.5" />
  </RouterLink>
  <button 
    v-else
    class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
    title="Editar"
  >
    <Pencil class="w-4 h-4" stroke-width="2.5" />
  </button>
</template>

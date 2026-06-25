<script setup lang="ts">
import { ChevronRight, Home } from 'lucide-vue-next';

interface BreadcrumbItem {
  name: string;
  to?: string | object;
}

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<template>
  <nav class="flex items-center text-sm text-slate-500 font-medium space-x-2" aria-label="Breadcrumb">
    <RouterLink to="/" class="hover:text-primary-600 transition-colors flex items-center">
      <Home class="w-4 h-4" />
    </RouterLink>
    
    <div v-for="(item, index) in items" :key="index" class="flex items-center space-x-2">
      <ChevronRight class="w-4 h-4 text-slate-400" />
      
      <RouterLink 
        v-if="item.to" 
        :to="item.to" 
        class="hover:text-primary-600 transition-colors"
      >
        {{ item.name }}
      </RouterLink>
      
      <span v-else class="text-slate-800 font-semibold">
        {{ item.name }}
      </span>
    </div>
  </nav>
</template>

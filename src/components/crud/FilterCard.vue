<script setup lang="ts">
import { ref } from 'vue';
import { Filter, X, Search, ChevronUp, ChevronDown } from 'lucide-vue-next';
import Card from '../ui/Card.vue';
import Button from '../ui/Button.vue';

const emit = defineEmits<{
  (e: 'filter'): void;
  (e: 'clear'): void;
}>();

const isOpen = ref(true);
</script>

<template>
  <Card variant="filter" class="mb-6 transition-all duration-300">
    <template #header>
      <div 
        class="flex items-center justify-between w-full cursor-pointer group"
        @click="isOpen = !isOpen"
      >
        <div class="flex items-center gap-2 text-slate-800">
          <Filter class="w-5 h-5 text-primary-500" />
          <h2 class="text-lg font-semibold select-none">Filtros</h2>
        </div>
        <button class="p-1 text-slate-400 group-hover:text-slate-600 transition-colors" type="button">
          <ChevronUp v-if="isOpen" class="w-5 h-5" />
          <ChevronDown v-else class="w-5 h-5" />
        </button>
      </div>
    </template>
    
    <div v-show="isOpen" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <slot></slot>
    </div>
    
    <template #footer v-if="isOpen">
      <div class="flex justify-end gap-2">
        <Button variant="outline" size="sm" @click="emit('clear')" type="button">
          <template #icon><X class="w-4 h-4 mr-1" /></template>
          Limpar
        </Button>
        <Button variant="primary" size="sm" @click="emit('filter')" type="button">
          <template #icon><Search class="w-4 h-4 mr-1" /></template>
          Buscar
        </Button>
      </div>
    </template>
  </Card>
</template>

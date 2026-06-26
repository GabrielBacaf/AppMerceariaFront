<script setup lang="ts">
import { Filter, X, Search } from 'lucide-vue-next';
import Card from '../ui/Card.vue';
import Button from '../ui/Button.vue';

const emit = defineEmits<{
  (e: 'filter'): void;
  (e: 'clear'): void;
}>();
</script>

<template>
  <Card class="mb-6">
    <template #header>
      <div class="flex items-center gap-2 text-slate-800">
        <Filter class="w-5 h-5 text-primary-500" />
        <h2 class="text-lg font-semibold">Filtros</h2>
      </div>
    </template>
    
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <slot></slot>
    </div>
    
    <template #footer>
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

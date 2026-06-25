<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { Search } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'search', value: string): void;
}>();

const props = defineProps<{
  placeholder?: string;
}>();

const query = ref('');
let timeoutId: number | null = null;

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  query.value = value;
  
  // Debounce 400ms
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
  }
  
  timeoutId = window.setTimeout(() => {
    emit('search', value);
  }, 400);
};

onBeforeUnmount(() => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
  }
});
</script>

<template>
  <div class="relative max-w-md w-full">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search class="h-5 w-5 text-slate-400" />
    </div>
    <input 
      type="text" 
      :value="query"
      @input="handleInput"
      :placeholder="placeholder || 'Buscar...'"
      class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors sm:text-sm"
    />
  </div>
</template>

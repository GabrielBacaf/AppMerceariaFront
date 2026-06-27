<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue';

export interface Column {
  key: string;
  label: string;
}

export interface PaginationInfo {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  from?: number | null;
  to?: number | null;
}

const props = defineProps<{
  columns: Column[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationInfo | null;
}>();

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

const hasData = computed(() => props.data && props.data.length > 0);

const handlePageChange = (page: number) => {
  if (props.pagination && page >= 1 && page <= props.pagination.last_page) {
    emit('page-change', page);
  }
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left text-slate-500">
      <thead class="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
        <tr>
          <th 
            v-for="col in columns" 
            :key="col.key" 
            scope="col" 
            class="px-6 py-3"
          >
            {{ col.label }}
          </th>
          <th scope="col" class="px-6 py-3 text-right" style="width: 200px">
            Ação
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length + 1" class="px-6 py-4 text-center text-slate-500">
            Carregando...
          </td>
        </tr>
        <tr v-else-if="!hasData">
          <td :colspan="columns.length + 1" class="px-6 py-4 text-center text-slate-500">
            Nenhum registro encontrado.
          </td>
        </tr>
        <tr 
          v-else
          v-for="(item, index) in data" 
          :key="item.id || index"
          class="bg-white border-b hover:bg-slate-50 transition-colors"
        >
          <td 
            v-for="col in columns" 
            :key="col.key" 
            class="px-6 py-4"
            :class="{ 'font-medium text-slate-900': col.key === 'id' || col.key === 'name' || col.key === 'title' }"
          >
            <slot :name="col.key" :item="item" :value="item[col.key]">
              {{ item[col.key] }}
            </slot>
          </td>
          <td class="px-6 py-4 text-right space-x-2 whitespace-nowrap">
            <slot name="actions" :item="item"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <div v-if="pagination && pagination.total > 0" class="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-white">
    <div class="text-sm text-slate-500">
      Exibindo {{ (pagination.current_page - 1) * pagination.per_page + 1 }} de 
      {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} 
      (Total: {{ pagination.total }})
    </div>
    <div class="flex items-center space-x-2">
      <button 
        @click="handlePageChange(pagination.current_page - 1)"
        :disabled="pagination.current_page <= 1"
        class="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 rounded disabled:opacity-50 transition-colors"
      >
        Anterior
      </button>
      <span class="text-sm text-slate-600 px-2 font-medium">Página {{ pagination.current_page }} de {{ pagination.last_page }}</span>
      <button 
        @click="handlePageChange(pagination.current_page + 1)"
        :disabled="pagination.current_page >= pagination.last_page"
        class="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 rounded disabled:opacity-50 transition-colors"
      >
        Próximo
      </button>
    </div>
  </div>
</template>


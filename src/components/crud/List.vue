<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue';
import { Inbox, ChevronLeft, ChevronRight } from 'lucide-vue-next';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  from?: number;
  to?: number;
}

const props = defineProps<{
  columns: Column[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  pagination?: PaginationInfo;
}>();

const emit = defineEmits<{
  (e: 'sort', key: string): void;
  (e: 'page-change', page: number): void;
}>();

const hasData = computed(() => props.data && props.data.length > 0);

const handlePageChange = (page: number) => {
  if (page >= 1 && props.pagination && page <= props.pagination.lastPage) {
    emit('page-change', page);
  }
};
</script>

<template>
  <div class="bg-white shadow-lg shadow-primary-900/5 border-t-4 border-t-primary-500 border-x border-b border-slate-200 rounded-xl overflow-hidden flex flex-col">
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead class="text-[13px] font-bold text-slate-500 uppercase tracking-widest bg-primary-50/50 border-b border-slate-200 backdrop-blur-sm sticky top-0 z-10">
          <tr>
            <th 
              v-for="col in columns" 
              :key="col.key" 
              class="px-6 py-5 transition-colors"
              :class="{ 'cursor-pointer hover:bg-slate-200/60 hover:text-slate-800': col.sortable }"
              @click="col.sortable && emit('sort', col.key)"
            >
              <div class="flex items-center gap-1">
                {{ col.label }}
              </div>
            </th>
            <th class="px-6 py-5 text-right">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <template v-if="loading">
            <tr>
              <td :colspan="columns.length + 1" class="px-6 py-12 text-center text-slate-500">
                <div class="flex justify-center items-center space-x-3">
                  <div class="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <span class="font-medium">Carregando dados...</span>
                </div>
              </td>
            </tr>
          </template>
          <template v-else-if="!hasData">
            <tr>
              <td :colspan="columns.length + 1" class="px-6 py-16 text-center text-slate-500">
                <div class="flex flex-col items-center justify-center">
                  <div class="bg-slate-50 p-4 rounded-full mb-4">
                    <Inbox class="w-12 h-12 text-slate-400" />
                  </div>
                  <p class="text-base font-medium text-slate-600">{{ emptyText || 'Nenhum registro encontrado.' }}</p>
                  <p class="text-sm text-slate-400 mt-1">Tente ajustar seus filtros ou cadastre um novo item.</p>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr 
              v-for="(item, index) in data" 
              :key="index"
              class="bg-white hover:bg-slate-50/80 transition-colors group"
            >
              <td 
                v-for="col in columns" 
                :key="col.key" 
                class="px-6 py-5 text-[15px] sm:text-base text-slate-700 font-medium whitespace-nowrap group-hover:text-slate-900 transition-colors"
              >
                <slot :name="col.key" :item="item" :value="item[col.key]">
                  {{ item[col.key] }}
                </slot>
              </td>
              <td class="px-6 py-5 whitespace-nowrap text-right text-[15px] font-medium">
                <slot name="actions" :item="item"></slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    
    <!-- Paginator -->
    <div v-if="pagination" class="bg-slate-50 px-6 py-5 border-t border-slate-200 flex items-center justify-between">
      <div class="text-[15px] text-slate-600">
        Mostrando <span class="font-bold text-slate-800">{{ pagination.from || 0 }}</span> até 
        <span class="font-bold text-slate-800">{{ pagination.to || 0 }}</span> de 
        <span class="font-bold text-slate-800">{{ pagination.total }}</span> registros
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="handlePageChange(pagination.currentPage - 1)"
          :disabled="pagination.currentPage <= 1"
          class="p-1.5 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Página Anterior"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>
        <div class="text-[15px] font-semibold text-slate-700 px-3">
          Página {{ pagination.currentPage }} de {{ pagination.lastPage }}
        </div>
        <button 
          @click="handlePageChange(pagination.currentPage + 1)"
          :disabled="pagination.currentPage >= pagination.lastPage"
          class="p-1.5 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Próxima Página"
        >
          <ChevronRight class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>


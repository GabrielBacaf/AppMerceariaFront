<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue';
import { Inbox } from 'lucide-vue-next';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

const props = defineProps<{
  columns: Column[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
}>();

const emit = defineEmits<{
  (e: 'sort', key: string): void;
}>();

const hasData = computed(() => props.data && props.data.length > 0);
</script>

<template>
  <div class="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th 
              v-for="col in columns" 
              :key="col.key" 
              class="px-6 py-3 font-medium tracking-wider"
              :class="{ 'cursor-pointer hover:bg-slate-100': col.sortable }"
              @click="col.sortable && emit('sort', col.key)"
            >
              {{ col.label }}
            </th>
            <th class="px-6 py-3 font-medium tracking-wider text-right">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr>
              <td :colspan="columns.length + 1" class="px-6 py-8 text-center text-slate-500">
                <div class="flex justify-center items-center space-x-2">
                  <div class="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Carregando...</span>
                </div>
              </td>
            </tr>
          </template>
          <template v-else-if="!hasData">
            <tr>
              <td :colspan="columns.length + 1" class="px-6 py-12 text-center text-slate-500">
                <div class="flex flex-col items-center justify-center">
                  <Inbox class="w-10 h-10 mb-3 text-slate-300" />
                  <p class="text-base">{{ emptyText || 'Nenhum registro encontrado.' }}</p>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr 
              v-for="(item, index) in data" 
              :key="index"
              class="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0"
            >
              <td 
                v-for="col in columns" 
                :key="col.key" 
                class="px-6 py-4 text-slate-700 whitespace-nowrap"
              >
                <slot :name="col.key" :item="item" :value="item[col.key]">
                  {{ item[col.key] }}
                </slot>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <slot name="actions" :item="item"></slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

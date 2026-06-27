<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  noPadding: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String, // 'create' | 'edit' | 'show' | 'filter' | 'list' | 'default'
    default: 'default'
  },
  // Configuração para transformar o Card em um Tabbed Card
  tabs: {
    type: Array as () => Array<{ id: string; label: string; hasError?: boolean; icon?: string }>,
    default: () => []
  },
  activeTab: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:activeTab']);

const borderClasses = computed(() => {
  if (props.variant === 'create') return 'border-t-4 border-t-primary-500 shadow-md shadow-primary-900/5';
  if (props.variant === 'edit') return 'border-t-4 border-t-emerald-500 shadow-md shadow-emerald-900/5';
  if (props.variant === 'show') return 'border-t-4 border-t-indigo-500 shadow-md shadow-indigo-900/5';
  if (props.variant === 'filter') return 'border-t-4 border-t-blue-500 shadow-md shadow-blue-900/5';
  if (props.variant === 'list') return 'border-t-4 border-t-cyan-500 shadow-md shadow-cyan-900/5';
  return '';
});

const changeTab = (id: string) => {
  emit('update:activeTab', id);
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" :class="borderClasses">
    
    <!-- Header Normal (quando não é um formato de Tabs) -->
    <div v-if="$slots.header && tabs.length === 0" class="px-4 md:px-6 py-4 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
      <slot name="header"></slot>
    </div>

    <!-- Header de Abas (estilo clássico com cor em destaque) -->
    <div v-if="tabs.length > 0" class="flex overflow-x-auto border-b border-slate-200 bg-slate-50/50 scrollbar-hide">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        @click="changeTab(tab.id)"
        :class="[
          'px-6 py-4 text-sm border-b-2 whitespace-nowrap transition-all duration-200 focus:outline-none flex items-center gap-2.5',
          activeTab === tab.id
            ? 'border-primary-600 text-white bg-primary-600 font-bold'
            : 'border-transparent text-slate-500 font-medium hover:text-slate-800 hover:border-slate-300 hover:bg-white'
        ]"
      >
        <span class="flex items-center gap-2">
          <i v-if="tab.icon" :class="[tab.icon, activeTab === tab.id ? 'text-white' : 'text-slate-400']"></i>
          {{ tab.label }}
        </span>
        
        <!-- Indicador Visual de Erro (Bolinha vermelha) -->
        <span v-if="tab.hasError" class="flex h-2.5 w-2.5 relative ml-1" title="Existem campos com erro nesta aba">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      </button>
    </div>

    <!-- Conteúdo do Card / Conteúdo da Aba Ativa -->
    <div :class="noPadding ? 'p-0' : 'p-4 md:p-6'">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="px-4 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
/* Ocultar barra de rolagem horizontal em telas muito pequenas, mantendo o scroll funcionando nas tabs */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

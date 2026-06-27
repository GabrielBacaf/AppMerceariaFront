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
  }
});

const borderClasses = computed(() => {
  if (props.variant === 'create') return 'border-t-4 border-t-primary-500 shadow-md shadow-primary-900/5';
  if (props.variant === 'edit') return 'border-t-4 border-t-emerald-500 shadow-md shadow-emerald-900/5';
  if (props.variant === 'show') return 'border-t-4 border-t-indigo-500 shadow-md shadow-indigo-900/5';
  if (props.variant === 'filter') return 'border-t-4 border-t-blue-500 shadow-md shadow-blue-900/5';
  if (props.variant === 'list') return 'border-t-4 border-t-cyan-500 shadow-md shadow-cyan-900/5';
  return '';
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" :class="borderClasses">
    <div v-if="$slots.header" class="px-4 md:px-6 py-4 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
      <slot name="header"></slot>
    </div>
    <div :class="noPadding ? 'p-0' : 'p-4 md:p-6'">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="px-4 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

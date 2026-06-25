<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  noPadding: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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

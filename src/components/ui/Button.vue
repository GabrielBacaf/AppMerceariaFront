<script setup lang="ts">
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
});

const emit = defineEmits(['click']);

const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  outline: 'border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700 focus:ring-slate-500',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-500',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-6 text-base',
};

const classes = computed(() => {
  return [
    baseClasses,
    variants[props.variant],
    sizes[props.size],
    props.loading ? 'opacity-70 pointer-events-none' : '',
  ].join(' ');
});

const handleClick = (e: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', e);
  }
};
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
    <slot name="icon" v-else></slot>
    <slot></slot>
  </button>
</template>

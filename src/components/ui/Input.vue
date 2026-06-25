<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue?: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  error: '',
  disabled: false,
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let value: string | number | null = target.value;
  if (props.type === 'number') {
    value = value === '' ? null : Number(value);
  }
  emit('update:modelValue', value);
};

const inputId = computed(() => `input-${Math.random().toString(36).substring(2, 9)}`);
</script>

<template>
  <div class="flex flex-col w-full">
    <label v-if="label" :for="inputId" class="mb-1 text-sm font-medium text-slate-700">
      {{ label }}
    </label>
    <div class="relative">
      <slot name="prefix" />
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="updateValue"
        class="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
        :class="[
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300',
          $slots.prefix ? 'pl-10' : '',
          $slots.suffix ? 'pr-10' : ''
        ]"
      />
      <slot name="suffix" />
    </div>
    <span v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</span>
  </div>
</template>

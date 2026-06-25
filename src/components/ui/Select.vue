<script setup lang="ts">
import { computed } from 'vue';

interface Option {
  name: string;
  value: string | number;
}

interface Props {
  modelValue?: string | number;
  label?: string;
  options?: Option[];
  error?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  error: '',
  disabled: false,
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLSelectElement).value);
};

const selectId = computed(() => `select-${Math.random().toString(36).substring(2, 9)}`);
</script>

<template>
  <div class="flex flex-col w-full">
    <label v-if="label" :for="selectId" class="mb-1 text-sm font-medium text-slate-700">
      {{ label }}
    </label>
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        @change="updateValue"
        class="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200"
        :class="[
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
        ]"
      >
        <option value="" disabled selected>Selecione uma opção</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.name }}
        </option>
      </select>
    </div>
    <span v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</span>
  </div>
</template>

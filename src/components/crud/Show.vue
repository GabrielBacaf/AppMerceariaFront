<script setup lang="ts" generic="T extends Record<string, any>">
export interface SchemaField {
  key: string;
  label: string;
}

defineProps<{
  title: string;
  item: T;
  schema: SchemaField[];
}>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
    <div class="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
      <h3 class="text-lg font-semibold leading-6 text-slate-900">{{ title }}</h3>
      <slot name="header-actions"></slot>
    </div>
    
    <div class="px-6 py-5">
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
        <div v-for="field in schema" :key="field.key" class="sm:col-span-1">
          <dt class="text-sm font-medium text-slate-500">{{ field.label }}</dt>
          <dd class="mt-1 text-sm text-slate-900 bg-slate-50 rounded-md px-3 py-2 border border-slate-100 min-h-[38px] flex items-center">
            <slot :name="field.key" :item="item" :value="item[field.key]">
              {{ item[field.key] || '-' }}
            </slot>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

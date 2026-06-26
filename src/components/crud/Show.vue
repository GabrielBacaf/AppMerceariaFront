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
  <div class="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden relative">
    <!-- Decorative background blob -->
    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 blur-3xl opacity-50 pointer-events-none"></div>
    
    <!-- Header -->
    <div class="px-8 py-7 border-b border-slate-100/80 flex items-center justify-between relative z-10 bg-white/40 backdrop-blur-md">
      <div>
        <h3 class="text-2xl font-extrabold text-slate-800 tracking-tight">{{ title }}</h3>
        <p class="text-sm text-slate-500 font-medium mt-1">Visão detalhada dos dados</p>
      </div>
      <div class="relative z-20">
        <slot name="header-actions"></slot>
      </div>
    </div>
    
    <!-- Bento Box Grid Body -->
    <div class="p-8 sm:p-10 relative z-10 bg-gradient-to-b from-transparent to-slate-50/30">
      <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <div v-for="field in schema" :key="field.key" class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:shadow-blue-500/5 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-center min-h-[100px] relative overflow-hidden">
          
          <!-- Subtle accent line on hover -->
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <dt class="text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-2 group-hover:text-blue-600 transition-colors">
            {{ field.label }}
          </dt>
          
          <dd class="text-[16px] text-slate-800 font-semibold break-words leading-snug">
            <slot :name="field.key" :item="item" :value="item[field.key]">
              {{ item[field.key] || '-' }}
            </slot>
          </dd>
        </div>

      </dl>
    </div>
  </div>
</template>

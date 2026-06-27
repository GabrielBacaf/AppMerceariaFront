<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, watch } from 'vue';

export interface SchemaField {
  key: string;
  label: string;
}

export interface SchemaGroup {
  title: string;
  fields?: SchemaField[];
  customSlot?: string;
}

const props = defineProps<{
  title?: string;
  item: T;
  schema?: SchemaField[];
  groups?: SchemaGroup[];
}>();

const getNestedValue = (obj: any, path: string) => {
  if (!obj) return null;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const computedGroups = computed(() => {
  if (props.groups && props.groups.length > 0) {
    return props.groups;
  }
  
  if (props.schema && props.schema.length > 0) {
    // If it's a small schema, keep it in one card
    if (props.schema.length <= 4) {
      return [{
        title: props.title || 'Detalhes do Registro',
        fields: props.schema
      }];
    }
    
    // Break into two cards automatically
    const half = Math.ceil(props.schema.length / 2);
    const firstHalf = props.schema.slice(0, half);
    const secondHalf = props.schema.slice(half);
    
    return [
      {
        title: 'Informações Principais',
        fields: firstHalf
      },
      {
        title: 'Mais Detalhes',
        fields: secondHalf
      }
    ];
  }
  
  return [];
});

const activeTabIndex = ref(0);

// Ensure valid tab index if groups somehow change
watch(computedGroups, (newGroups) => {
  if (activeTabIndex.value >= newGroups.length) {
    activeTabIndex.value = 0;
  }
});
</script>

<template>
  <div class="bg-white rounded-2xl border-t-4 border-t-purple-500 border-x border-b border-slate-200 shadow-md shadow-purple-900/5 overflow-hidden">
    <!-- Header with Title -->
    <div class="px-6 sm:px-10 py-7 bg-gradient-to-r from-purple-50/40 to-transparent border-b border-slate-200">
      <h3 v-if="title" class="text-2xl font-bold text-slate-900 tracking-tight">{{ title }}</h3>
    </div>
    
    <template v-if="computedGroups.length > 0">
      <!-- Tabs Navigation (only show if more than 1 group) -->
      <div v-if="computedGroups.length > 1" class="px-6 sm:px-8 border-b border-slate-200">
        <nav class="-mb-px flex space-x-8 overflow-x-auto hide-scrollbar" aria-label="Tabs">
          <button 
            v-for="(group, index) in computedGroups" 
            :key="index"
            @click="activeTabIndex = index"
            :class="[
              activeTabIndex === index 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 outline-none'
            ]"
          >
            {{ group.title }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="px-0 py-0">
        <template v-if="computedGroups[activeTabIndex]?.customSlot">
          <div class="p-0">
            <slot :name="computedGroups[activeTabIndex]?.customSlot" :item="item"></slot>
          </div>
        </template>
        
        <template v-else-if="computedGroups[activeTabIndex]?.fields">
          <dl class="divide-y divide-slate-100">
            <div 
              v-for="field in computedGroups[activeTabIndex]?.fields" 
              :key="field.key" 
              class="flex flex-col sm:flex-row px-6 sm:px-10 py-5 sm:py-6 hover:bg-slate-50/80 transition-colors duration-150 group-row"
            >
              <dt class="w-full sm:w-1/3 max-w-[280px] text-[13px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest shrink-0 group-row-hover:text-slate-600 transition-colors mt-0.5">
                {{ field.label }}
              </dt>
              <dd class="mt-2 sm:mt-0 flex-1 text-base sm:text-[17px] text-slate-800 font-medium break-words leading-relaxed">
                <slot :name="field.key" :item="item" :value="getNestedValue(item, field.key)">
                  {{ getNestedValue(item, field.key) || '—' }}
                </slot>
              </dd>
            </div>
          </dl>
        </template>
      </div>
    </template>
    
    <!-- Footer with Voltar button -->
    <div class="px-6 sm:px-10 py-5 bg-slate-50 border-t border-slate-200">
      <button 
        type="button" 
        @click="$router.back()"
        class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Voltar
      </button>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

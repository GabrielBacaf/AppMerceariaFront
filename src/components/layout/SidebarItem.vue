<script setup lang="ts">
import { ChevronDown, ChevronRight } from 'lucide-vue-next';
import type { MenuItem } from '../../config/menu';
import { useRoute } from 'vue-router';

interface Props {
  item: MenuItem;
  isMinimized?: boolean;
  isOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isMinimized: false,
  isOpen: false
});

const emit = defineEmits(['toggle', 'close']);

const route = useRoute();

const isActive = (path: string) => {
  if (path === '/') return route.path === path;
  return route.path.startsWith(path);
};

const isParentActive = (item: MenuItem) => {
  if (isActive(item.path)) return true;
  if (item.children) {
    return item.children.some((child) => isActive(child.path));
  }
  return false;
};
</script>

<template>
  <!-- Item Sem Submenu -->
  <router-link
    v-if="!item.children"
    :to="item.path"
    @click="emit('close')"
    class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative"
    :class="isActive(item.path) ? 'bg-primary-600 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'"
    :title="isMinimized ? item.name : ''"
  >
    <component 
      :is="item.icon" 
      class="w-5 h-5 shrink-0 transition-colors"
      :class="isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-white'"
    />
    <span class="font-medium whitespace-nowrap transition-opacity duration-300" :class="isMinimized ? 'opacity-0 w-0 hidden' : 'opacity-100'">{{ item.name }}</span>
  </router-link>

  <!-- Item Com Submenu -->
  <div v-else class="space-y-1">
    <button
      @click="emit('toggle', item.name)"
      class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group relative"
      :class="isParentActive(item) ? 'bg-slate-800/50 text-white' : 'hover:bg-slate-800 hover:text-white'"
      :title="isMinimized ? item.name : ''"
    >
      <div class="flex items-center gap-3">
        <component 
          :is="item.icon" 
          class="w-5 h-5 shrink-0 transition-colors"
          :class="isParentActive(item) ? 'text-white' : 'text-slate-400 group-hover:text-white'"
        />
        <span class="font-medium whitespace-nowrap transition-opacity duration-300" :class="isMinimized ? 'opacity-0 w-0 hidden' : 'opacity-100'">{{ item.name }}</span>
      </div>
      <component 
        v-if="!isMinimized"
        :is="isOpen ? ChevronDown : ChevronRight" 
        class="w-4 h-4 text-slate-500 transition-transform"
      />
    </button>
    
    <!-- Submenu -->
    <div 
      v-if="isOpen && !isMinimized" 
      class="pl-10 pr-2 py-1 space-y-1 overflow-hidden"
    >
      <router-link
        v-for="child in item.children"
        :key="child.path"
        :to="child.path"
        @click="emit('close')"
        class="block px-3 py-2 text-sm rounded-md transition-colors"
        :class="isActive(child.path) ? 'text-primary-400 bg-slate-800/30 font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'"
      >
        {{ child.name }}
      </router-link>
    </div>
  </div>
</template>

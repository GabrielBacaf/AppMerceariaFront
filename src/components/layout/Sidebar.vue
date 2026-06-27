<script setup lang="ts">
import { ref } from 'vue';
import { ShoppingCart, X, Menu, Search } from 'lucide-vue-next';
import SidebarItem from './SidebarItem.vue';
import { menuItems } from '../../config/menu';

interface Props {
  isOpen?: boolean;
  isMinimized?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  isMinimized: false
});

const emit = defineEmits(['close', 'toggle-minimize']);

// Estado para menus abertos (submenus)
const openMenus = ref<string[]>([]);

const toggleMenu = (name: string) => {
  if (props.isMinimized) {
    // Se está minimizado e clicar em um item com submenu, expande a sidebar primeiro
    emit('toggle-minimize');
    if (!openMenus.value.includes(name)) openMenus.value.push(name);
    return;
  }
  
  if (openMenus.value.includes(name)) {
    openMenus.value = openMenus.value.filter(m => m !== name);
  } else {
    openMenus.value.push(name);
  }
};
</script>

<template>
  <aside 
    class="bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto overflow-x-hidden z-30 transition-all duration-300 ease-in-out lg:translate-x-0 group/sidebar rounded-r-2xl shadow-xl shadow-primary-500/15"
    :class="[
      isOpen ? 'translate-x-0' : '-translate-x-full',
      isMinimized ? 'w-20' : 'w-64'
    ]"
  >
    <div class="h-16 flex items-center justify-between px-4 border-b border-slate-700/50 shrink-0">
      <div 
        class="flex items-center gap-3 overflow-hidden text-white font-bold text-lg whitespace-nowrap transition-all duration-300"
        :class="isMinimized ? 'opacity-0 w-0 hidden' : 'opacity-100'"
      >
        <ShoppingCart class="w-8 h-8 p-1 shrink-0 text-primary-500" />
        <span>App Mercearia</span>
      </div>
      <button @click="emit('close')" class="lg:hidden p-1 text-slate-400 hover:text-white focus:outline-none shrink-0" :class="isMinimized ? 'hidden' : ''">
        <X class="w-6 h-6" />
      </button>
      <button 
        @click="emit('toggle-minimize')" 
        class="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none shrink-0 transition-all" 
        :class="isMinimized ? 'mx-auto w-full justify-center' : ''"
      >
        <Menu class="w-5 h-5" />
      </button>
    </div>
    
    <nav class="flex-1 py-4 px-3 space-y-1 overflow-x-hidden">
      <!-- Barra de pesquisa -->
      <div class="mb-4 px-1" :class="isMinimized ? 'hidden' : 'block'">
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Pesquisar..." class="w-full pl-9 pr-3 py-2 bg-slate-800 text-slate-300 border-transparent focus:bg-slate-700 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-lg text-sm transition-all outline-none placeholder-slate-500" />
        </div>
      </div>

      <SidebarItem
        v-for="item in menuItems"
        :key="item.name"
        :item="item"
        :is-minimized="isMinimized"
        :is-open="openMenus.includes(item.name)"
        @toggle="toggleMenu"
        @close="emit('close')"
      />
    </nav>
  </aside>
</template>

<style scoped>
/* Oculta a barra de rolagem para navegadores WebKit (Chrome, Safari, Opera) */
aside::-webkit-scrollbar {
  display: none;
}

/* Oculta a barra de rolagem para IE, Edge e Firefox */
aside {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

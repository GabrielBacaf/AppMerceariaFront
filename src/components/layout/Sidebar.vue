<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ShoppingCart, X, Menu, LogOut } from 'lucide-vue-next';
import SidebarItem from './SidebarItem.vue';
import { menuItems } from '../../config/menu';
import { AuthService } from '../../services';

interface Props {
  isOpen?: boolean;
  isMinimized?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  isMinimized: false
});

const emit = defineEmits(['close', 'toggle-minimize']);
const router = useRouter();

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

const handleLogout = async () => {
  try {
    await AuthService.logout();
  } catch (error) {
    console.error('Erro ao deslogar da API:', error);
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/login');
  }
};
</script>

<template>
  <aside 
    class="bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto overflow-x-hidden z-30 transition-all duration-300 ease-in-out lg:translate-x-0 group/sidebar"
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

    <!-- Usuário Rodapé -->
    <div class="p-4 border-t border-slate-800 shrink-0">
      <div class="flex items-center justify-between px-2 lg:px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors overflow-hidden">
        <div class="flex items-center gap-3 overflow-hidden cursor-pointer flex-1" :class="isMinimized ? 'justify-center' : ''">
          <div class="w-8 h-8 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
            GB
          </div>
          <div class="flex-1 min-w-0 transition-opacity duration-300" :class="isMinimized ? 'opacity-0 w-0 hidden' : 'opacity-100'">
            <p class="text-sm font-medium text-white truncate">Gabriel Bacaf</p>
            <p class="text-xs text-slate-400 truncate">Admin</p>
          </div>
        </div>
        <button 
          @click="handleLogout" 
          title="Sair do Sistema"
          class="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-700 transition-colors shrink-0"
          :class="isMinimized ? 'hidden' : 'block'"
        >
          <LogOut class="w-5 h-5" />
        </button>
      </div>
    </div>
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

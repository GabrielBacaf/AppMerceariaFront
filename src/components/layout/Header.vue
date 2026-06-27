<script setup lang="ts">
import { Bell, Menu, Power } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { AuthService } from '../../services';

const emit = defineEmits(['toggle-sidebar']);
const router = useRouter();

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
  <header class="w-full h-20 bg-white/60 backdrop-blur-xl border-b border-slate-200/80 shadow-lg shadow-primary-500/15 rounded-b-2xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-all">
    <div class="flex items-center gap-4">
      <button @click="emit('toggle-sidebar')" class="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none">
        <Menu class="w-6 h-6" />
      </button>
      <h1 class="text-lg md:text-xl font-semibold text-slate-800 truncate">
        <slot name="title">Página Inicial</slot>
      </h1>
    </div>

    <div class="flex items-center gap-4 md:gap-6">
      <!-- Notificações -->
      <button class="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
        <Bell class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>

      <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>
      
      <!-- Usuário e Logout -->
      <div class="flex items-center gap-3">
        <div class="text-right hidden sm:block">
          <p class="text-sm font-medium text-slate-800 leading-none">Gabriel Bacaf</p>
          <p class="text-xs text-slate-500 mt-1">Admin</p>
        </div>
        <div class="w-9 h-9 shrink-0 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
          GB
        </div>
        <button 
          @click="handleLogout" 
          title="Sair do Sistema" 
          class="bg-slate-800 text-white hover:bg-slate-700 shadow-md shadow-slate-800/20 p-2 rounded-xl transition-all focus:outline-none ml-2"
        >
          <Power class="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
</template>

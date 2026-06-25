<script setup lang="ts">
import { Bell, Search, Menu } from 'lucide-vue-next';

const emit = defineEmits(['toggle-sidebar']);
</script>

<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 w-full">
    <div class="flex items-center gap-4">
      <button @click="emit('toggle-sidebar')" class="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none">
        <Menu class="w-6 h-6" />
      </button>
      <h1 class="text-lg md:text-xl font-semibold text-slate-800 truncate">
        <slot name="title">Página Inicial</slot>
      </h1>
    </div>

    <div class="flex items-center gap-4 md:gap-6">
      <div class="relative hidden sm:block">
        <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Pesquisar..." 
          class="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-lg text-sm w-48 md:w-64 transition-all outline-none"
        />
      </div>
      
      <button class="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
        <Bell class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
    </div>
  </header>
</template>

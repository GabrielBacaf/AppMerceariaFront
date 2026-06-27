<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import Footer from './Footer.vue';

interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Dashboard',
});

const isMobileSidebarOpen = ref(false);
const isSidebarMinimized = ref(false);

const handleSidebarClose = () => {
  if (window.innerWidth >= 1024) {
    isSidebarMinimized.value = true;
  } else {
    isMobileSidebarOpen.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex">
    <!-- Overlay do Sidebar no mobile -->
    <div 
      v-if="isMobileSidebarOpen" 
      @click="isMobileSidebarOpen = false" 
      class="fixed inset-0 bg-slate-900/50 z-20 lg:hidden transition-opacity"
    ></div>

    <Sidebar 
      :isOpen="isMobileSidebarOpen" 
      :isMinimized="isSidebarMinimized"
      @close="handleSidebarClose" 
      @toggle-minimize="isSidebarMinimized = !isSidebarMinimized"
    />
    
    <!-- Main content wrapper to offset the fixed sidebar on desktop -->
    <div 
      class="flex-1 flex flex-col min-h-screen transition-all duration-300 w-full overflow-x-hidden"
      :class="isSidebarMinimized ? 'lg:ml-20' : 'lg:ml-64'"
    >
      <Header @toggle-sidebar="isMobileSidebarOpen = true; isSidebarMinimized = false">
        <template #title>{{ title }}</template>
      </Header>
      
      <main class="flex-1 p-4 md:p-8">
        <div class="max-w-7xl mx-auto">
          <slot></slot>
        </div>
      </main>

      <!-- Footer Responsivo -->
      <Footer />
    </div>
  </div>
</template>

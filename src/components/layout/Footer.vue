<script setup lang="ts">
// Footer.vue
</script>

<template>
  <footer class="bg-white border-t border-slate-200 py-5 px-4 md:px-8 mt-auto">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-4 text-sm text-slate-500">
      <p class="w-full md:w-auto text-center md:text-left">© {{ new Date().getFullYear() }} App Mercearia. Todos os direitos reservados.</p>
      <div class="flex gap-4 justify-end w-full md:w-auto">
        <a href="#" class="hover:text-primary-600 transition-colors">Suporte</a>
        <a href="#" class="hover:text-primary-600 transition-colors">Termos</a>
        <a href="#" class="hover:text-primary-600 transition-colors">Privacidade</a>
      </div>
    </div>
  </footer>
</template>

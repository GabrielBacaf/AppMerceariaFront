<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import { showAlert } from '../../utils/alert';

const props = defineProps<{
  confirmTitle?: string;
  confirmText?: string;
}>();

const emit = defineEmits(['confirm']);

const handleClick = async () => {
  const t = props.confirmTitle || 'Excluir';
  const msg = props.confirmText || 'Tem certeza que deseja excluir?';
  const result = await showAlert.confirm(t, msg);
  if (result.isConfirmed) {
    emit('confirm');
  }
};
</script>

<template>
  <button 
    @click.prevent="handleClick"
    class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-red-600 bg-red-600 text-white hover:bg-red-700 hover:border-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1 shadow-sm"
    title="Excluir"
  >
    <Trash2 class="w-4 h-4" stroke-width="2.5" />
  </button>
</template>

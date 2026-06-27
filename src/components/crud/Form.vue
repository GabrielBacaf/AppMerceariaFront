<script setup lang="ts">
import { Save, ArrowLeft } from 'lucide-vue-next';
import Card from '../ui/Card.vue';
import Button from '../ui/Button.vue';

const props = defineProps<{
  title?: string;
  isSubmitting: boolean;
  isEdit?: boolean;
  tabs?: Array<{ id: string; label: string; hasError?: boolean; icon?: string }>;
}>();

const activeTab = defineModel<string>('activeTab', { default: '' });

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>();
</script>

<template>
  <Card :variant="isEdit ? 'edit' : 'create'" :tabs="tabs" v-model:activeTab="activeTab">
    <template #header v-if="title && (!tabs || tabs.length === 0)">
      <h2 class="text-lg font-medium text-slate-800">{{ title }}</h2>
    </template>

    <form @submit.prevent="emit('submit')" class="space-y-6">
      <div v-if="!tabs || tabs.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <slot></slot>
      </div>
      <div v-else>
        <slot></slot>
      </div>
      
      <!-- Optional full width slots -->
      <slot name="full-width"></slot>

      <div class="pt-4 flex justify-between gap-3 border-t border-slate-100">
        <Button type="button" class="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200" @click="emit('cancel')">
          <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
          Voltar
        </Button>
        <div class="flex gap-3">
          <Button variant="danger" type="button" @click="emit('cancel')">Cancelar</Button>
          <Button variant="primary" type="submit" :disabled="isSubmitting">
            <template #icon><Save class="w-4 h-4 mr-2" /></template>
            {{ isEdit ? 'Atualizar' : 'Salvar' }}
          </Button>
        </div>
      </div>
    </form>
  </Card>
</template>

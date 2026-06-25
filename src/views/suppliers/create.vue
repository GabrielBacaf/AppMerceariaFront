<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Save, ArrowLeft } from 'lucide-vue-next';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import Input from '../../components/ui/Input.vue';

import { showAlert } from '../../utils/alert';
import { CrudService } from '../../services/crudService';


const router = useRouter();
const apiService = new CrudService('suppliers');

const formData = ref({
  "fantasy_name": "",
  "legal_name": "",
  "cnpj": ""
});

const isSubmitting = ref(false);



const handleSave = async () => {
  isSubmitting.value = true;
    try {
    await apiService.create(formData.value);
    showAlert.success('Fornecedor criado(a) com sucesso!');
    setTimeout(() => router.push('/suppliers'), 2000);
  } catch (error: any) {
    showAlert.error(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
        <div class="flex items-center justify-between mb-6">
      <div class="flex gap-2">
        <Button variant="secondary" size="sm" @click="router.push('/suppliers')">
          <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
          Voltar
        </Button>
      </div>
    </div>

    <Card>
      <template #header>
        <h2 class="text-lg font-medium text-slate-800">Novo(a) Fornecedor</h2>
      </template>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input v-model="formData.fantasy_name" label="Nome Fantasia" type="text" />
          <Input v-model="formData.legal_name" label="Razão Social" type="text" />
          <Input v-model="formData.cnpj" label="CNPJ" type="text" />
        </div>
        <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="danger" type="button" @click="router.push('/suppliers')">Cancelar</Button>
          <Button variant="primary" type="submit" :disabled="isSubmitting">
            <template #icon><Save class="w-4 h-4 mr-2" /></template>
            Salvar
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

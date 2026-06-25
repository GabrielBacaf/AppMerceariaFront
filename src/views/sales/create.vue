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
const apiService = new CrudService('sales');

const formData = ref({
  "discount": 0,
  "delivery_price": 0,
  "products": [],
  "payments": []
});

const isSubmitting = ref(false);



const handleSave = async () => {
  isSubmitting.value = true;
    try {
    await apiService.create(formData.value);
    showAlert.success('Venda criado(a) com sucesso!');
    setTimeout(() => router.push('/sales'), 2000);
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
        <Button variant="secondary" size="sm" @click="router.push('/sales')">
          <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
          Voltar
        </Button>
      </div>
    </div>

    <Card>
      <template #header>
        <h2 class="text-lg font-medium text-slate-800">Novo(a) Venda</h2>
      </template>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input v-model="formData.discount" label="Desconto" type="number" />
          <Input v-model="formData.delivery_price" label="Valor Frete" type="number" />
        </div>
        <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="danger" type="button" @click="router.push('/sales')">Cancelar</Button>
          <Button variant="primary" type="submit" :disabled="isSubmitting">
            <template #icon><Save class="w-4 h-4 mr-2" /></template>
            Salvar
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

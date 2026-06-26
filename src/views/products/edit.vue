<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Save, ArrowLeft } from 'lucide-vue-next';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import Input from '../../components/ui/Input.vue';
import Select from '../../components/ui/Select.vue';
import { showAlert } from '../../utils/alert';
import { CrudService } from '../../services/crudService';
import { EnumService } from '../../services/enumService';

const router = useRouter();
const breadcrumbItems = [
  { name: 'Produtos', to: '/products' },
  { name: 'Editar' }
];

const route = useRoute();
const apiService = new CrudService('products');
const purchasesService = new CrudService('purchases');

const formData = ref({
  name: '',
  barcode: '',
  expiration_date: '',
  category: '',
  sale_value: 0,
  amount: 0,
  purchase_value: 0,
  purchase_id: null
});

const isSubmitting = ref(false);

const enums = ref<any>({ categories: [] });
const purchasesList = ref<any[]>([]);

onMounted(async () => {
  try {
    const enumData = await EnumService.getEnums();
    enums.value = enumData;
    
    const purchasesData = await purchasesService.getAll();
    purchasesList.value = (Array.isArray(purchasesData) ? purchasesData : purchasesData.data || []).map((p: any) => ({
      name: p.title || `Compra #${p.id}`,
      value: p.id
    }));
    
    const data = await apiService.getById(route.params.id as string);
    formData.value = { ...formData.value, ...data };
  } catch (error) {
    showAlert.error('Erro ao carregar dados.');
  }
});

const handleSave = async () => {
  isSubmitting.value = true;
    try {
    await apiService.update(route.params.id as string, formData.value);
    showAlert.success('Produto atualizado(a) com sucesso!');
    setTimeout(() => router.push('/products'), 2000);
  } catch (error: any) {
    showAlert.error(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
        

    <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    <Card variant="edit">
      <template #header>
        <h2 class="text-lg font-medium text-slate-800">Editar Produto</h2>
      </template>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input v-model="formData.name" label="Nome" type="text" />
          <Input v-model="formData.barcode" label="Código de Barras" type="text" />
          <Input v-model="formData.expiration_date" label="Data de Validade" type="date" />
          <Select v-model="formData.category" label="Categoria" :options="enums.categories" />
          <Input v-model="formData.sale_value" label="Valor de Venda" type="number" />
          <Input v-model="formData.amount" label="Quantidade (Amount)" type="number" />
          <Input v-model="formData.purchase_value" label="Valor de Compra" type="number" />
          <Select v-model="formData.purchase_id" label="Compra" :options="purchasesList" />
        </div>
        <div class="pt-4 flex justify-between gap-3 border-t border-slate-100">
          <Button type="button" class="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200" @click="router.push('/products')">
            <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
            Voltar
          </Button>
          <div class="flex gap-3">
          <Button variant="danger" type="button" @click="router.push('/products')">Cancelar</Button>
          <Button variant="primary" type="submit" :disabled="isSubmitting">
            <template #icon><Save class="w-4 h-4 mr-2" /></template>
            Atualizar
          </Button>
        </div>
        </div>
        </form>
    </Card>
    </div>
  </div>
</template>

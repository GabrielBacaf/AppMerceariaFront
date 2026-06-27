<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Form from '../../components/crud/Form.vue';
import Input from '../../components/ui/Input.vue';
import Select from '../../components/ui/Select.vue';
import { useCrudForm } from '../../composables/useCrudForm';
import { CrudService } from '../../services/crudService';
import { EnumService } from '../../services/enumService';

const breadcrumbItems = [
  { name: 'Produtos', to: '/products' },
  { name: 'Novo' }
];

const { isSubmitting, handleSave, handleCancel } = useCrudForm('products', '/products');
const purchasesService = new CrudService('purchases');

const formData = ref({
  name: '',
  barcode: '',
  expiration_date: '',
  category: '',
  sale_value: 0,
  amount: 0,
  purchase_value: 0,
  purchase_id: null as number | null
});

const enums = ref<any>({ categories: [] });
const purchasesList = ref<any[]>([]);

onMounted(async () => {
  try {
    const data = await EnumService.getEnums();
    enums.value = data;
    
    const purchasesData = await purchasesService.getAll();
    purchasesList.value = (Array.isArray(purchasesData) ? purchasesData : purchasesData.data || []).map((p: any) => ({
      name: p.title || `Compra #${p.id}`,
      value: p.id
    }));
  } catch (e) {
    console.error('Erro ao buscar dados', e);
  }
});

const submit = () => handleSave(formData.value);
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    
    <Form 
      title="Novo(a) Produto" 
      :is-submitting="isSubmitting" 
      @submit="submit" 
      @cancel="handleCancel"
    >
      <Input v-model="formData.name" label="Nome" type="text" />
      <Input v-model="formData.barcode" label="Código de Barras" type="text" />
      <Input v-model="formData.expiration_date" label="Data de Validade" type="date" />
      <Select v-model="formData.category" label="Categoria" :options="enums.categories" />
      <Input v-model="formData.sale_value" label="Valor de Venda" type="number" />
      <Input v-model="formData.amount" label="Quantidade (Amount)" type="number" />
      <Input v-model="formData.purchase_value" label="Valor de Compra" type="number" />
      <Select v-model="formData.purchase_id" label="Compra" :options="purchasesList" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Save, ArrowLeft } from 'lucide-vue-next';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import Input from '../../components/ui/Input.vue';
import Select from '../../components/ui/Select.vue';
import { showAlert } from '../../utils/alert';
import { CrudService } from '../../services/crudService';
import { EnumService } from '../../services/enumService';

const router = useRouter();
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

const handleSave = async () => {
  isSubmitting.value = true;
    try {
    await apiService.create(formData.value);
    showAlert.success('Produto criado(a) com sucesso!');
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
        <div class="flex items-center justify-between mb-6">
      <div class="flex gap-2">
        <Button variant="secondary" size="sm" @click="router.push('/products')">
          <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
          Voltar
        </Button>
      </div>
    </div>

    <Card>
      <template #header>
        <h2 class="text-lg font-medium text-slate-800">Novo(a) Produto</h2>
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
        <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="danger" type="button" @click="router.push('/products')">Cancelar</Button>
          <Button variant="primary" type="submit" :disabled="isSubmitting">
            <template #icon><Save class="w-4 h-4 mr-2" /></template>
            Salvar
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

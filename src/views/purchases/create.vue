<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
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
  { name: 'Compras', to: '/purchases' },
  { name: 'Novo' }
];

const apiService = new CrudService('purchases');
const suppliersService = new CrudService('suppliers');

const formData = ref({
  title: '',
  description: '',
  purchase_date: '',
  supplier_id: null,
  invoice_id: null,
  payments: [
    { value: 0, payment_type: '', payment_status: '' }
  ]
});

const isSubmitting = ref(false);

const enums = ref<any>({ payment_types: [], payment_statuses: [] });
const suppliers = ref<any[]>([]);

onMounted(async () => {
  try {
    const enumData = await EnumService.getEnums();
    enums.value = enumData;
    
    const suppliersData = await suppliersService.getAll();
    suppliers.value = (Array.isArray(suppliersData) ? suppliersData : suppliersData.data || []).map((s: any) => ({
      name: s.fantasy_name || s.legal_name,
      value: s.id
    }));
  } catch (e) {
    console.error('Erro ao buscar dados', e);
  }
});

const handleSave = async () => {
  isSubmitting.value = true;
    try {
    const payload: any = { ...formData.value };
    if (!payload.invoice_id) delete payload.invoice_id;
    if (!payload.supplier_id) delete payload.supplier_id;

    await apiService.create(payload);
    showAlert.success('Compra criada com sucesso!');
    setTimeout(() => router.push('/purchases'), 2000);
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
    <Card variant="create">
      <template #header>
        <h2 class="text-lg font-medium text-slate-800">Nova Compra</h2>
      </template>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input v-model="formData.title" label="Título" type="text" />
          <Input v-model="formData.description" label="Descrição" type="text" />
          <Input v-model="formData.purchase_date" label="Data da Compra" type="date" />
          <Select v-model="formData.supplier_id" label="Fornecedor" :options="suppliers" />
          <Input v-model="formData.invoice_id" label="Nota" type="number" />
        </div>

        <div class="mt-6">
          <h3 class="text-md font-medium text-slate-700 mb-4 border-b pb-2">Informações de Pagamento</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input v-model="formData.payments[0].value" label="Valor" type="number" />
            <Select v-model="formData.payments[0].payment_type" label="Tipo de Pagamento" :options="enums.payment_types" />
            <Select v-model="formData.payments[0].payment_status" label="Status do Pagamento" :options="enums.payment_statuses" />
          </div>
        </div>

        <div class="pt-4 flex justify-between gap-3 border-t border-slate-100">
          <Button type="button" class="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200" @click="router.push('/purchases')">
            <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
            Voltar
          </Button>
          <div class="flex gap-3">
          <Button variant="danger" type="button" @click="router.push('/purchases')">Cancelar</Button>
          <Button variant="primary" type="submit" :disabled="isSubmitting">
            <template #icon><Save class="w-4 h-4 mr-2" /></template>
            Salvar
          </Button>
        </div>
        </div>
        </form>
    </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Form from '../../components/crud/Form.vue';
import Input from '../../components/ui/Input.vue';
import Select from '../../components/ui/Select.vue';
import { useCrudForm } from '../../composables/useCrudForm';
import { CrudService } from '../../services/crudService';
import { EnumService } from '../../services/enumService';

const route = useRoute();
const breadcrumbItems = [
  { name: 'Compras', to: '/purchases' },
  { name: 'Editar' }
];

const { isSubmitting, handleSave, handleLoad, handleCancel } = useCrudForm('purchases', '/purchases');
const suppliersService = new CrudService('suppliers');

const formData = ref({
  title: '',
  description: '',
  purchase_date: '',
  supplier_id: null as number | null,
  invoice_id: null as number | null,
  payments: [
    { value: 0, payment_type: '', payment_status: '' }
  ]
});

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
    
    const data = await handleLoad(route.params.id as string);
    if (data) {
      formData.value.title = data.title || '';
      formData.value.description = data.description || '';
      formData.value.purchase_date = data.purchase_date || '';
      formData.value.supplier_id = data.supplier_id || null;
      formData.value.invoice_id = data.invoice_id || null;
      
      if (data.payments && data.payments.length > 0) {
        formData.value.payments = data.payments;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar dados.', error);
  }
});

const submit = () => {
  const payload: any = { ...formData.value };
  if (!payload.invoice_id) delete payload.invoice_id;
  if (!payload.supplier_id) delete payload.supplier_id;
  handleSave(payload, true, route.params.id as string);
};
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    
    <Form 
      title="Editar Compra" 
      :is-submitting="isSubmitting" 
      is-edit
      @submit="submit" 
      @cancel="handleCancel"
    >
      <Input v-model="formData.title" label="Título" type="text" />
      <Input v-model="formData.description" label="Descrição" type="text" />
      <Input v-model="formData.purchase_date" label="Data da Compra" type="date" />
      <Select v-model="formData.supplier_id" label="Fornecedor" :options="suppliers" />
      <Input v-model="formData.invoice_id" label="Nota" type="number" />
      
      <template #full-width>
        <div class="mt-6" v-for="(payment, index) in formData.payments" :key="index">
          <h3 class="text-md font-medium text-slate-700 mb-4 border-b pb-2">Informações de Pagamento</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input v-model="payment.value" label="Valor" type="number" />
            <Select v-model="payment.payment_type" label="Tipo de Pagamento" :options="enums.payment_types" />
            <Select v-model="payment.payment_status" label="Status do Pagamento" :options="enums.payment_statuses" />
          </div>
        </div>
      </template>
    </Form>
  </div>
</template>

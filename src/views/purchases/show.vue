<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Show from '../../components/crud/Show.vue';
import EditButton from '../../components/ui/EditButton.vue';
import { PurchaseService } from '../../services';

const route = useRoute();
const id = route.params.id as string;

const breadcrumbItems = ref([
  { name: 'Compras', to: '/purchases' },
  { name: 'Detalhes' }
]);

const item = ref<any>({});
const schema = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Título' },
  { key: 'description', label: 'Descrição' },
  { key: 'supplier_id', label: 'Fornecedor ID' },
  { key: 'invoice_id', label: 'ID da Fatura' },
  { key: 'purchase_date', label: 'Data da Compra' },
  { key: 'count_value', label: 'Valor da Conta' },
  { key: 'status', label: 'Status' },
  { key: 'user_id', label: 'Usuário ID' },
];

onMounted(async () => {
  try {
    const data = await PurchaseService.getById(id);
    item.value = data.data || data; // handle generic response wrapping
    if (breadcrumbItems.value[1]) {
      breadcrumbItems.value[1].name = item.value?.title || `Detalhes #${id}`;
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-slate-900">Detalhes da Compra: {{ item?.title || id }}</h1>
    </div>

    <Show title="Informações Gerais" :item="item" :schema="schema">
      <template #header-actions>
        <EditButton :to="`/purchases/${id}/edit`" />
      </template>
    </Show>

    <div v-if="item.products && item.products.length" class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <h3 class="text-lg font-semibold leading-6 text-slate-900">Produtos Comprados</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nome</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Qtd</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Compra</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="product in item.products" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{ product.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{ product.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{ product.amount }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">R$ {{ Number(product.purchase_value).toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">R$ {{ (Number(product.amount) * Number(product.purchase_value)).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="item.payments && item.payments.length" class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <h3 class="text-lg font-semibold leading-6 text-slate-900">Pagamentos</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="payment in item.payments" :key="payment.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{ payment.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">R$ {{ Number(payment.value).toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ payment.payment_status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{ payment.payment_type }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
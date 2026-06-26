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

const groups = [
  { title: 'Informações Gerais', fields: schema },
  { title: 'Produtos Comprados', customSlot: 'products' },
  { title: 'Pagamentos', customSlot: 'payments' },
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

    <Show :item="item" :groups="groups">
      <template #header-actions>
        <EditButton :to="`/purchases/${id}/edit`" />
      </template>

      <!-- Custom Slot for Products -->
      <template #products="{ item }">
        <div v-if="item.products && item.products.length" class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="text-[13px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" class="px-6 py-5">ID</th>
                <th scope="col" class="px-6 py-5">Nome</th>
                <th scope="col" class="px-6 py-5">Qtd</th>
                <th scope="col" class="px-6 py-5">Valor Compra</th>
                <th scope="col" class="px-6 py-5">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="product in item.products" :key="product.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-5 font-bold text-[15px] sm:text-base text-slate-900">{{ product.id }}</td>
                <td class="px-6 py-5 text-[15px] sm:text-base text-slate-700 font-medium">{{ product.name }}</td>
                <td class="px-6 py-5 text-[15px] sm:text-base text-slate-700 font-medium">{{ product.amount }}</td>
                <td class="px-6 py-5 text-[15px] sm:text-base text-slate-700 font-medium">R$ {{ Number(product.purchase_value).toFixed(2) }}</td>
                <td class="px-6 py-5 text-[15px] sm:text-base text-slate-700 font-medium text-indigo-600 font-bold">R$ {{ (Number(product.amount) * Number(product.purchase_value)).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="p-8 text-center text-slate-500 text-[15px] font-medium">
          Nenhum produto registrado nesta compra.
        </div>
      </template>

      <!-- Custom Slot for Payments -->
      <template #payments="{ item }">
        <div v-if="item.payments && item.payments.length" class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="text-[13px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" class="px-6 py-5">ID</th>
                <th scope="col" class="px-6 py-5">Valor</th>
                <th scope="col" class="px-6 py-5">Status</th>
                <th scope="col" class="px-6 py-5">Tipo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="payment in item.payments" :key="payment.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-5 font-bold text-[15px] sm:text-base text-slate-900">{{ payment.id }}</td>
                <td class="px-6 py-5 text-[15px] sm:text-base text-slate-700 font-medium">R$ {{ Number(payment.value).toFixed(2) }}</td>
                <td class="px-6 py-5 text-[15px] sm:text-base text-slate-700 font-medium">
                  <span class="px-3 py-1 inline-flex text-[13px] leading-5 font-bold rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {{ payment.payment_status }}
                  </span>
                </td>
                <td class="px-6 py-5 text-[15px] sm:text-base text-slate-700 font-medium">{{ payment.payment_type }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="p-8 text-center text-slate-500 text-[15px] font-medium">
          Nenhum pagamento registrado.
        </div>
      </template>

    </Show>
  </div>
</template>
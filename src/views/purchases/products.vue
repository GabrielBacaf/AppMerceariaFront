<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PackagePlus, X, Pencil, Save, ArrowLeft, Search, Plus } from 'lucide-vue-next';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import Input from '../../components/ui/Input.vue';
import Select from '../../components/ui/Select.vue';
import EditButton from '../../components/ui/EditButton.vue';
import DeleteButton from '../../components/ui/DeleteButton.vue';
import List from '../../components/crud/List.vue';
import { CrudService } from '../../services/crudService';
import { EnumService } from '../../services/enumService';
import { showAlert } from '../../utils/alert';
import axios from 'axios';

const productColumns = [
  { key: 'name', label: 'Produto' },
  { key: 'barcode', label: 'Cód. Barras' },
  { key: 'expiration_date', label: 'Validade' },
  { key: 'amount', label: 'Qtd' },
  { key: 'purchase_value', label: 'Valor UN' }
];

const route = useRoute();
const router = useRouter();
const purchaseId = route.params.id as string;

const purchaseService = new CrudService('purchases');
const productService = new CrudService('products');

const purchase = ref<any>(null);
const loadingPurchase = ref(false);

const isCreatingNewProduct = ref(false);

// Formulário de busca e vínculo (Produto existente)
const barcodeSearch = ref('');
const searchResult = ref<any>(null);
const linkFormData = ref({
  purchase_value: 0,
  sale_value: 0,
  amount: 0,
  expiration_date: ''
});

// Formulário de novo produto
const newProductData = ref({
  name: '',
  barcode: '',
  expiration_date: '',
  category: '',
  sale_value: 0,
  amount: 0,
  purchase_value: 0,
  purchase_id: purchaseId
});

const enums = ref<any>({ categories: [] });
const isSubmitting = ref(false);
const showToastMessage = ref('');

const fetchPurchase = async () => {
  loadingPurchase.value = true;
  try {
    const res = await purchaseService.getById(purchaseId);
    purchase.value = res.data || res;
  } catch (e) {
    console.error('Erro ao buscar compra', e);
  } finally {
    loadingPurchase.value = false;
  }
};

onMounted(async () => {
  fetchPurchase();
  try {
    const data = await EnumService.getEnums();
    enums.value = data;
  } catch (e) {
    console.error('Erro ao buscar enums', e);
  }
});

const showToast = (msg: string) => {
  showToastMessage.value = msg;
  setTimeout(() => showToastMessage.value = '', 3000);
};

// Buscar produto por código de barras
const handleSearchBarcode = async () => {
  if (!barcodeSearch.value) return;
  try {
    const res = await productService.getAll({ barcode: barcodeSearch.value });
    const products = Array.isArray(res) ? res : (res.data || []);
    if (products.length > 0) {
      searchResult.value = products[0];
      linkFormData.value.amount = 1;
      linkFormData.value.purchase_value = 0;
      linkFormData.value.sale_value = products[0].sale_value || 0;
      let expDate = products[0].expiration_date || '';
      if (expDate && expDate.includes('/')) {
        const parts = expDate.split('/');
        if (parts.length === 3) expDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      linkFormData.value.expiration_date = expDate;
    } else {
      searchResult.value = null;
      showToast('Produto não encontrado. Cadastre um novo.');
    }
  } catch (e) {
    console.error(e);
  }
};

// Vincular/Atualizar produto existente
const handleLinkProduct = async () => {
  if (!searchResult.value) return;
  isSubmitting.value = true;
  try {
    const { stock_quantity, created_at, updated_at, pivot, expiration_date, ...rest } = searchResult.value;

    const payload = {
      ...rest,
      purchase_id: purchaseId,
      amount: linkFormData.value.amount,
      purchase_value: linkFormData.value.purchase_value,
      sale_value: linkFormData.value.sale_value,
      expiration_date: linkFormData.value.expiration_date || null
    };
    await productService.update(searchResult.value.id, payload);
    showToast('Produto vinculado com sucesso!');
    barcodeSearch.value = '';
    searchResult.value = null;
    linkFormData.value = { purchase_value: 0, sale_value: 0, amount: 0, expiration_date: '' };
    fetchPurchase();
  } catch (e: any) {
    console.error(e);
    showAlert.error(e);
  } finally {
    isSubmitting.value = false;
  }
};

// Cadastrar novo produto
const handleSaveNewProduct = async () => {
  isSubmitting.value = true;
  try {
    newProductData.value.purchase_id = purchaseId;
    await productService.create(newProductData.value);
    showToast('Novo produto cadastrado com sucesso!');
    
    // Limpar formulário
    newProductData.value = {
      name: '', barcode: '', expiration_date: '', category: '',
      sale_value: 0, amount: 0, purchase_value: 0, purchase_id: purchaseId
    };
    isCreatingNewProduct.value = false;
    fetchPurchase();
  } catch (e: any) {
    console.error(e);
    showAlert.error(e);
  } finally {
    isSubmitting.value = false;
  }
};

// Desvincular produto (chama endpoint personalizado)
const handleUnlinkProduct = async (productId: string | number) => {
  try {
    const token = localStorage.getItem('auth_token');
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    await axios.delete(`${apiBase}/purchases/${purchaseId}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    showToast('Produto removido da compra!');
    fetchPurchase();
  } catch (e) {
    console.error(e);
    showToast('Erro ao remover produto');
  }
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
};

const totalPaid = computed(() => {
  if (!purchase.value?.payments) return 0;
  return purchase.value.payments.reduce((sum: number, p: any) => sum + parseFloat(p.value || 0), 0);
});

</script>

<template>
  <div class="space-y-6 relative">
    <div v-if="showToastMessage" class="fixed top-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300">
      {{ showToastMessage }}
    </div>

    <Breadcrumb :items="[{ name: 'Dar entrada no Estoque', to: '/purchases' }, { name: 'Vincular Produtos' }]" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-1">
        <Card>
          <template #header>
            <h2 class="text-lg font-bold text-slate-800">Resumo da Compra</h2>
          </template>
          <div v-if="loadingPurchase" class="text-slate-500">Carregando...</div>
          <div v-else-if="purchase" class="space-y-4">
            <div>
              <p class="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1">Título</p>
              <p class="text-xl font-medium text-slate-800">{{ purchase.title }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1">Status</p>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-sm">
                {{ purchase.status }}
              </span>
            </div>
            <div class="pt-6 border-t border-slate-200">
              <p class="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1">Valor Total Pago</p>
              <p class="text-3xl font-extrabold text-slate-800">{{ formatCurrency(totalPaid) }}</p>
            </div>
            <div class="pt-4">
              <p class="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1">Valor Restante (count_value)</p>
              <p class="text-4xl font-black" :class="purchase.count_value < 0 ? 'text-red-600' : 'text-green-600'">
                {{ formatCurrency(purchase.count_value) }}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div class="lg:col-span-2">
        <Card v-if="!isCreatingNewProduct">
          <template #header>
            <div class="flex items-center justify-between w-full">
              <h2 class="text-lg font-bold text-slate-800">Produtos da Compra</h2>
              <Button variant="primary" size="sm" @click="isCreatingNewProduct = true">
                <template #icon><Plus class="w-4 h-4 mr-2" /></template>
                Novo Produto
              </Button>
            </div>
          </template>

          <div class="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200">
            <h3 class="text-sm font-medium text-slate-700 mb-3">Vincular Produto Existente</h3>
            <div class="flex gap-2 mb-4">
              <div class="flex-1">
                <Input v-model="barcodeSearch" placeholder="Código de Barras..." @keyup.enter="handleSearchBarcode" />
              </div>
              <Button variant="secondary" @click="handleSearchBarcode">
                <template #icon><Search class="w-4 h-4" /></template>
              </Button>
            </div>

            <div v-if="searchResult" class="flex flex-col md:flex-row gap-4 items-end border-t border-slate-200 pt-4 mt-2">
              <div class="flex-1">
                <p class="text-xs text-slate-500">Produto Selecionado</p>
                <p class="font-medium">{{ searchResult.name }}</p>
              </div>
              <div class="w-24">
                <Input v-model="linkFormData.amount" type="number" label="Qtd" />
              </div>
              <div class="w-32">
                <Input v-model="linkFormData.purchase_value" type="number" label="V. Compra" />
              </div>
              <div class="w-32">
                <Input v-model="linkFormData.sale_value" type="number" label="V. Venda" />
              </div>
              <div class="w-40">
                <Input v-model="linkFormData.expiration_date" type="date" label="Validade" />
              </div>
              <Button variant="primary" @click="handleLinkProduct" :disabled="isSubmitting">Vincular</Button>
            </div>
          </div>

          <List
            :columns="productColumns"
            :data="purchase?.products || []"
            :loading="loadingPurchase"
          >
            <template #expiration_date="{ item }">
              {{ item.pivot?.expiration_date ? new Date(item.pivot.expiration_date + 'T00:00:00').toLocaleDateString('pt-BR') : '-' }}
            </template>
            <template #amount="{ item }">
              <div class="text-right">{{ item.pivot?.amount }}</div>
            </template>
            <template #purchase_value="{ item }">
              <div class="text-right">{{ formatCurrency(item.pivot?.purchase_value) }}</div>
            </template>
            <template #actions="{ item }">
              <EditButton 
                @click="barcodeSearch = item.barcode; handleSearchBarcode()"
                title="Editar Vínculo"
              />
              <DeleteButton 
                @confirm="handleUnlinkProduct(item.id)"
                confirmText="Deseja realmente remover este produto da compra?"
                title="Remover Vínculo"
              />
            </template>
          </List>
        </Card>

        <Card v-else>
          <template #header>
            <div class="flex justify-between items-center w-full">
              <h2 class="text-lg font-medium text-slate-800">Cadastrar Novo Produto</h2>
              <button @click="isCreatingNewProduct = false" class="text-slate-400 hover:text-slate-600">
                <X class="w-5 h-5" />
              </button>
            </div>
          </template>

          <form @submit.prevent="handleSaveNewProduct" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input v-model="newProductData.name" label="Nome" type="text" />
              <Input v-model="newProductData.barcode" label="Código de Barras" type="text" />
              <Input v-model="newProductData.expiration_date" label="Data de Validade" type="date" />
              <Select v-model="newProductData.category" label="Categoria" :options="enums.categories" />
              <Input v-model="newProductData.sale_value" label="Valor de Venda" type="number" />
              <Input v-model="newProductData.amount" label="Quantidade Inicial" type="number" />
              <Input v-model="newProductData.purchase_value" label="Valor de Compra" type="number" />
            </div>
            <div class="pt-4 flex justify-between gap-3 border-t border-slate-100">
              <Button variant="danger" type="button" @click="isCreatingNewProduct = false">
                <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" :disabled="isSubmitting">
                <template #icon><Save class="w-4 h-4 mr-2" /></template>
                Salvar Produto
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </div>
  </div>
</template>

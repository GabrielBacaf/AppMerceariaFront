<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ShoppingCart, Search, Keyboard } from 'lucide-vue-next';
import { showAlert } from '../../utils/alert';
import { CrudService } from '../../services/crudService';
import api from '../../services/api';
import DeleteButton from '../../components/ui/DeleteButton.vue';

const router = useRouter();
const apiService = new CrudService('sales');
const productService = new CrudService('products');
const clientService = new CrudService('clients');

const barcodeInput = ref('');
const quantityInput = ref(1);
const receivedValue = ref(0);
const discount = ref(Number(localStorage.getItem('pdv_discount') || 0));
const deliveryPrice = ref(Number(localStorage.getItem('pdv_delivery') || 0));
const clientId = ref<number | null>(localStorage.getItem('pdv_client') ? Number(localStorage.getItem('pdv_client')) : null);

// Dados
const clients = ref<any[]>([]);

// Referências para os inputs para focar com hotkeys
const refBarcode = ref<HTMLInputElement | null>(null);
const refQuantity = ref<HTMLInputElement | null>(null);
const refDiscount = ref<HTMLInputElement | null>(null);
const refDelivery = ref<HTMLInputElement | null>(null);
const refClient = ref<HTMLSelectElement | null>(null);
const refReceived = ref<HTMLInputElement | null>(null);

const cart = ref<any[]>(JSON.parse(localStorage.getItem('pdv_cart') || '[]'));
const isSubmitting = ref(false);
const searching = ref(false);

const isFinalizing = ref(false);
const payments = ref<any[]>([]);
const paymentTypes = ref<any[]>([]);
const currentPaymentValue = ref(0);
const currentPaymentType = ref('');

watch(cart, (val) => localStorage.setItem('pdv_cart', JSON.stringify(val)), { deep: true });
watch(discount, (val) => localStorage.setItem('pdv_discount', val.toString()));
watch(deliveryPrice, (val) => localStorage.setItem('pdv_delivery', val.toString()));
watch(clientId, (val) => {
  if (val) localStorage.setItem('pdv_client', val.toString());
  else localStorage.removeItem('pdv_client');
});

const clearSession = () => {
  localStorage.removeItem('pdv_cart');
  localStorage.removeItem('pdv_discount');
  localStorage.removeItem('pdv_delivery');
  localStorage.removeItem('pdv_client');
  cart.value = [];
  discount.value = 0;
  deliveryPrice.value = 0;
  clientId.value = null;
  isFinalizing.value = false;
  payments.value = [];
};

const cancelSale = async () => {
  const result = await showAlert.confirm('Cancelar Venda', 'Tem certeza que deseja cancelar e limpar os dados da venda atual?');
  if (result.isConfirmed) {
    clearSession();
  }
};

const subtotal = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
});

const total = computed(() => {
  return subtotal.value - discount.value + deliveryPrice.value;
});

const totalPaid = computed(() => payments.value.reduce((acc, p) => acc + p.value, 0));
const remainingToPay = computed(() => Math.max(0, total.value - totalPaid.value));

const change = computed(() => {
  if (isFinalizing.value) return totalPaid.value - total.value;
  return receivedValue.value > 0 ? receivedValue.value - total.value : 0;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const handleBarcodeSearch = async () => {
  if (!barcodeInput.value) return;
  searching.value = true;
  try {
    const res = await productService.getAll({ barcode: barcodeInput.value });
    if (res && res.length > 0) {
      const product = res[0];
      addToCart(product);
      barcodeInput.value = '';
      quantityInput.value = 1; // reset quantity
    } else {
      showAlert.error('Produto não encontrado!');
    }
  } catch (e) {
    showAlert.error('Erro ao buscar produto.');
  } finally {
    searching.value = false;
    nextTick(() => {
      refBarcode.value?.focus();
    });
  }
};

const addToCart = (product: any) => {
  const price = product.sale_value !== undefined ? Number(product.sale_value) : 0;
  
  cart.value.push({
    product_id: product.id,
    barcode: product.barcode,
    name: product.name,
    quantity: quantityInput.value,
    unit_price: price, 
  });
};

const removeFromCart = (index: number) => {
  cart.value.splice(index, 1);
};

const initiateFinalize = () => {
  if (cart.value.length === 0) {
    showAlert.error('Adicione produtos para finalizar a venda.');
    return;
  }
  isFinalizing.value = true;
  currentPaymentValue.value = remainingToPay.value;
};

const addPayment = () => {
  if (!currentPaymentType.value || currentPaymentValue.value <= 0) return;
  payments.value.push({
    value: currentPaymentValue.value,
    payment_type: currentPaymentType.value,
    payment_status: 'Pago'
  });
  currentPaymentValue.value = remainingToPay.value;
};

const removePayment = (index: number) => {
  payments.value.splice(index, 1);
  currentPaymentValue.value = remainingToPay.value;
};

const handleSave = async () => {
  if (cart.value.length === 0) {
    showAlert.error('Adicione produtos para finalizar a venda.');
    return;
  }
  if (totalPaid.value < total.value) {
    showAlert.error('O valor pago é menor que o total da venda.');
    return;
  }
  isSubmitting.value = true;

  const payload: any = {
    discount: discount.value,
    delivery_price: deliveryPrice.value,
    products: cart.value.map(item => ({
      id: item.product_id,
      quantity: item.quantity
    })),
    payments: payments.value.map(p => ({
      value: p.value,
      payment_type: p.payment_type,
      payment_status: 'Pago'
    }))
  };

  if (clientId.value) {
    payload.client_id = clientId.value;
  }

  try {
    await apiService.create(payload);
    showAlert.success('Venda finalizada com sucesso!');
    clearSession();
    router.push('/sales');
  } catch (error: any) {
    let errorMsg = 'Erro ao finalizar venda.';
    if (error.response?.data) {
      if (error.response.data.errors) {
         // Formata os erros de validação
         const errors = error.response.data.errors;
         const firstKey = Object.keys(errors)[0];
         if (firstKey) {
            errorMsg = errors[firstKey][0];
         } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
         }
      } else if (error.response.data.message) {
         errorMsg = error.response.data.message;
      }
    }
    showAlert.error(errorMsg);
    console.error('Erro de validação:', error.response?.data);
  } finally {
    isSubmitting.value = false;
  }
};

const loadClients = async () => {
  try {
    const res = await clientService.getAll();
    clients.value = res || [];
  } catch(e) {
    console.error("Erro ao carregar clientes", e);
  }
}

const loadEnums = async () => {
  try {
    const res = await api.get('/enums');
    paymentTypes.value = res.data.payment_types || [];
    if (paymentTypes.value.length > 0) {
       currentPaymentType.value = paymentTypes.value[0].value;
    }
  } catch (e) {
    console.error("Erro ao carregar enums", e);
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'F1':
      e.preventDefault();
      refClient.value?.focus();
      break;
    case 'F2':
      e.preventDefault();
      refDiscount.value?.focus();
      break;
    case 'F3':
      e.preventDefault();
      refDelivery.value?.focus();
      break;
    case 'F4':
      e.preventDefault();
      refQuantity.value?.focus();
      break;
    case 'F9':
      e.preventDefault();
      cancelSale();
      break;
    case 'F10':
      e.preventDefault();
      if (!isFinalizing.value) initiateFinalize();
      else handleSave();
      break;
    case 'Escape':
      e.preventDefault();
      router.push('/sales');
      break;
  }
};

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);
  refBarcode.value?.focus();
  await loadClients();
  await loadEnums();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

</script>

<template>
  <div class="min-h-[85vh] bg-slate-50 -m-6 p-4 md:p-6 flex flex-col font-sans">
    
    <!-- Top Header -->
    <div class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 flex justify-between items-center shadow-lg mb-6">
      <div class="flex items-center space-x-4">
        <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
           <ShoppingCart class="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">CAIXA ABERTO</h1>
          <p class="text-blue-200 text-sm font-medium tracking-wide uppercase">Frente de Loja • PDV</p>
        </div>
      </div>
      <div class="text-right hidden md:block">
        <div class="text-sm text-blue-200">Operador Caixa</div>
        <div class="font-bold text-lg uppercase">Admin</div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col lg:flex-row flex-1 gap-6">
      
      <!-- Left Panel (Inputs) -->
      <div class="w-full lg:w-4/12 flex flex-col gap-6">
        
        <!-- CÓDIGO DE BARRAS & QUANTIDADE -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col gap-5 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
          
          <div>
             <label class="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Código de Barras <span class="text-slate-300">Escaneie o item</span>
             </label>
             <div class="relative">
                <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                <input 
                  type="text" 
                  ref="refBarcode"
                  v-model="barcodeInput"
                  @keyup.enter="handleBarcodeSearch"
                  :disabled="searching"
                  autofocus
                  class="w-full pl-12 pr-4 py-4 bg-slate-50 text-slate-800 text-xl font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
                  placeholder="Ler código..."
                />
             </div>
          </div>

          <div>
             <label class="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quantidade <span class="bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono text-[10px]">F4</span>
             </label>
             <input 
               type="number" 
               ref="refQuantity"
               v-model.number="quantityInput"
               min="1"
               class="w-full p-4 bg-slate-50 text-slate-800 text-xl font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
             />
          </div>
        </div>
        
        <!-- OUTROS CAMPOS (CLIENTE, FRETE, DESCONTO) -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col gap-4 flex-1">
           <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Keyboard class="w-4 h-4 text-slate-400" /> Opções da Venda
           </h3>
           
           <div>
              <label class="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                Cliente <span class="text-slate-400 font-mono text-[10px] bg-slate-100 px-1.5 rounded">F1</span>
              </label>
              <select ref="refClient" v-model="clientId" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium appearance-none">
                 <option :value="null">Consumidor Final</option>
                 <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
           </div>
           
           <div class="grid grid-cols-2 gap-4 mt-2">
             <div>
                <label class="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  Desconto <span class="text-slate-400 font-mono text-[10px] bg-slate-100 px-1.5 rounded">F2</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                  <input ref="refDiscount" v-model.number="discount" type="number" step="0.01" class="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium" />
                </div>
             </div>
             <div>
                <label class="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  Frete <span class="text-slate-400 font-mono text-[10px] bg-slate-100 px-1.5 rounded">F3</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                  <input ref="refDelivery" v-model.number="deliveryPrice" type="number" step="0.01" class="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium" />
                </div>
             </div>
           </div>
        </div>

      </div>

      <!-- Right Panel (List and Totals) -->
      <div class="w-full lg:w-8/12 flex flex-col gap-6">
        
        <template v-if="!isFinalizing">
          <!-- Product List -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 flex-1 overflow-hidden flex flex-col min-h-[350px]">
            <div class="flex-1 overflow-y-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-100 z-10">
                <tr>
                  <th class="py-4 px-5 font-bold uppercase tracking-wider text-xs">Item</th>
                  <th class="py-4 px-5 font-bold uppercase tracking-wider text-xs">Código</th>
                  <th class="py-4 px-5 font-bold uppercase tracking-wider text-xs w-full">Descrição</th>
                  <th class="py-4 px-5 font-bold uppercase tracking-wider text-xs text-center">Qtd</th>
                  <th class="py-4 px-5 font-bold uppercase tracking-wider text-xs text-right">Vlr. Unit.</th>
                  <th class="py-4 px-5 font-bold uppercase tracking-wider text-xs text-right">Total</th>
                  <th class="py-4 px-5"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="(item, index) in cart" :key="index" class="hover:bg-blue-50/50 transition-colors group">
                  <td class="py-3 px-5 text-slate-400 font-medium">{{ (index + 1).toString().padStart(3, '0') }}</td>
                  <td class="py-3 px-5 font-mono text-slate-500 text-xs">{{ item.barcode }}</td>
                  <td class="py-3 px-5 font-bold text-slate-800">{{ item.name }}</td>
                  <td class="py-3 px-5 text-center font-semibold text-slate-700 bg-slate-50 group-hover:bg-blue-100/50">{{ item.quantity }}</td>
                  <td class="py-3 px-5 text-right font-medium text-slate-600">{{ formatCurrency(item.unit_price) }}</td>
                  <td class="py-3 px-5 text-right font-bold text-blue-700">{{ formatCurrency(item.unit_price * item.quantity) }}</td>
                  <td class="py-3 px-5 text-right">
                    <DeleteButton @confirm="removeFromCart(index)" confirmText="Tem certeza que deseja remover este item da venda?" />
                  </td>
                </tr>
                <tr v-if="cart.length === 0">
                  <td colspan="7" class="py-20 px-5 text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                       <ShoppingCart class="w-8 h-8 text-slate-300" />
                    </div>
                    <p class="text-slate-400 font-medium text-lg">O carrinho está vazio</p>
                    <p class="text-slate-400 text-sm mt-1">Escaneie um código de barras para começar</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </template>
        <template v-else>
          <!-- Payment Panel -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 flex-1 overflow-hidden flex flex-col min-h-[350px] p-6">
             <h2 class="text-xl font-bold text-slate-800 mb-4">Pagamento</h2>
             
             <div class="grid grid-cols-2 gap-4 mb-6">
               <div>
                 <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Forma de Pagamento</label>
                 <select v-model="currentPaymentType" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium">
                   <option v-for="type in paymentTypes" :key="type.value" :value="type.value">{{ type.name }}</option>
                 </select>
               </div>
               <div>
                 <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Valor</label>
                 <div class="flex gap-2">
                   <input type="number" step="0.01" v-model.number="currentPaymentValue" @keyup.enter="addPayment" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium" />
                   <button @click="addPayment" class="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg font-bold transition-colors">Adicionar</button>
                 </div>
               </div>
             </div>

             <div class="flex-1 overflow-y-auto">
                <table class="w-full text-left text-sm whitespace-nowrap">
                  <thead class="bg-slate-50 text-slate-500">
                    <tr>
                      <th class="py-3 px-4 font-bold uppercase tracking-wider text-xs">Forma de Pagamento</th>
                      <th class="py-3 px-4 font-bold uppercase tracking-wider text-xs text-right">Valor</th>
                      <th class="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="(p, index) in payments" :key="index">
                      <td class="py-3 px-4 font-bold text-slate-800">{{ paymentTypes.find(t => t.value === p.payment_type)?.name || p.payment_type }}</td>
                      <td class="py-3 px-4 text-right font-medium text-slate-600">{{ formatCurrency(p.value) }}</td>
                      <td class="py-3 px-4 text-right">
                        <DeleteButton @confirm="removePayment(index)" confirmTitle="Remover Pagamento" confirmText="Deseja remover este pagamento?" />
                      </td>
                    </tr>
                    <tr v-if="payments.length === 0">
                      <td colspan="3" class="py-10 text-center text-slate-400 text-sm">Nenhum pagamento adicionado</td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </div>
        </template>

        <!-- Totals Area -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           <div class="bg-indigo-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              
              <div class="flex justify-between items-center mb-6 text-indigo-200">
                <span class="text-sm font-bold uppercase tracking-wider">Subtotal</span>
                <span class="text-2xl font-semibold">{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="flex justify-between items-end border-t border-indigo-700/50 pt-4">
                <span class="text-sm font-bold uppercase tracking-wider text-indigo-300">Total a Pagar</span>
                <span class="text-5xl font-black text-white tracking-tight">{{ formatCurrency(total) }}</span>
              </div>
           </div>

           <div class="bg-white text-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                   {{ isFinalizing ? 'Total Recebido (Pagamentos)' : 'Total Recebido' }}
                </label>
                <div class="relative" v-if="!isFinalizing">
                   <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">R$</span>
                   <input 
                     type="number" 
                     step="0.01"
                     ref="refReceived"
                     v-model.number="receivedValue"
                     class="w-full pl-12 pr-4 py-3 bg-slate-50 text-slate-800 text-3xl font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-right transition-all"
                     placeholder="0,00"
                   />
                </div>
                <div v-else class="text-3xl font-bold text-slate-800 text-right">{{ formatCurrency(totalPaid) }}</div>
              </div>
              <div class="flex justify-between items-end mt-6">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {{ change >= 0 ? 'Troco' : 'Falta Pagar' }}
                </span>
                <span class="text-4xl font-black tracking-tight" :class="{'text-emerald-500': change >= 0, 'text-red-500': change < 0}">
                  {{ formatCurrency(Math.abs(change)) }}
                </span>
              </div>
           </div>
        </div>

      </div>
    </div>

    <!-- Footer Hotkeys -->
    <div class="mt-6 flex flex-wrap gap-3 justify-center text-xs font-bold text-slate-500">
      <div class="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200/60"><span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">F1</span> Cliente</div>
      <div class="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200/60"><span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">F2</span> Desconto</div>
      <div class="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200/60"><span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">F3</span> Frete</div>
      <div class="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200/60"><span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">F4</span> Quantidade</div>
      <div @click="cancelSale" class="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg shadow-sm border border-red-100 cursor-pointer hover:bg-red-100 transition-colors"><span class="bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-mono">F9</span> Cancelar</div>
      <div @click="!isFinalizing ? initiateFinalize() : handleSave()" class="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg shadow-sm border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors"><span class="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono">F10</span> {{ isFinalizing ? 'Confirmar' : 'Finalizar' }}</div>
      <div class="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200/60"><span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">ESC</span> Sair</div>
    </div>
  </div>
</template>

<style scoped>
/* Remove arrows from number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>

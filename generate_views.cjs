const fs = require('fs');
const path = require('path');

const entities = {
  purchases: { endpoint: 'purchases', title: 'Compra' },
  products: { endpoint: 'products', title: 'Produto' },
  clients: { endpoint: 'clients', title: 'Cliente' },
  roles: { endpoint: 'roles', title: 'Perfil/Role' },
  sales: { endpoint: 'sales', title: 'Venda' },
  suppliers: { endpoint: 'suppliers', title: 'Fornecedor' },
  users: { endpoint: 'users', title: 'Usuário' },
};

entities.purchases.fields = [
  { key: 'title', label: 'Título', type: 'text' },
  { key: 'description', label: 'Descrição', type: 'text' },
  { key: 'purchase_date', label: 'Data da Compra', type: 'date' },
  { key: 'count_value', label: 'Valor', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', enumKey: 'statuses' },
];
entities.purchases.initial = { title: '', description: '', purchase_date: '', count_value: 0, status: 'PENDENTE', payments: [] };

entities.products.fields = [
  { key: 'name', label: 'Nome', type: 'text' },
  { key: 'barcode', label: 'Código de Barras', type: 'text' },
  { key: 'expiration_date', label: 'Data de Validade', type: 'date' },
  { key: 'category', label: 'Categoria', type: 'select', enumKey: 'categories' },
  { key: 'sale_value', label: 'Valor de Venda', type: 'number' },
  { key: 'stock_quantity', label: 'Qtd Estoque', type: 'number' },
];
entities.products.initial = { name: '', barcode: '', expiration_date: '', category: '', sale_value: 0, stock_quantity: 0 };

entities.clients.fields = [
  { key: 'name', label: 'Nome Completo', type: 'text' },
  { key: 'email', label: 'E-mail', type: 'email' },
  { key: 'phone', label: 'Telefone', type: 'text' },
];
entities.clients.initial = { name: '', email: '', phone: '', address: { street: 'Rua', number: '123', city: 'Cidade', state: 'Estado', postal_code: '00000-000', country: 'Brasil' } };

entities.roles.fields = [
  { key: 'name', label: 'Nome do Perfil', type: 'text' },
];
entities.roles.initial = { name: '', permissions: [] };

entities.sales.fields = [
  { key: 'discount', label: 'Desconto', type: 'number' },
  { key: 'delivery_price', label: 'Valor Frete', type: 'number' },
];
entities.sales.initial = { discount: 0, delivery_price: 0, products: [], payments: [] };

entities.suppliers.fields = [
  { key: 'fantasy_name', label: 'Nome Fantasia', type: 'text' },
  { key: 'legal_name', label: 'Razão Social', type: 'text' },
  { key: 'cnpj', label: 'CNPJ', type: 'text' },
];
entities.suppliers.initial = { fantasy_name: '', legal_name: '', cnpj: '' };

entities.users.fields = [
  { key: 'name', label: 'Nome', type: 'text' },
  { key: 'login', label: 'Login', type: 'text' },
  { key: 'email', label: 'E-mail', type: 'email' },
  { key: 'password', label: 'Senha', type: 'password' },
  { key: 'password_confirmation', label: 'Confirmação de Senha', type: 'password' },
];
entities.users.initial = { name: '', login: '', email: '', password: '', password_confirmation: '', roles: [] };

function generateCreateContent(key, config) {
  const hasSelect = config.fields.some(f => f.type === 'select');
  const enumKeys = config.fields.filter(f => f.type === 'select').map(f => f.enumKey);
  const fieldsTemplate = config.fields.map(f => {
    if (f.type === 'select') {
      return `          <Select v-model="formData.${f.key}" label="${f.label}" :options="enums.${f.enumKey}" />`;
    }
    return `          <Input v-model="formData.${f.key}" label="${f.label}" type="${f.type}" />`;
  }).join('\n');

  return `<script setup lang="ts">
import { ref${hasSelect ? ', onMounted' : ''} } from 'vue';
import { useRouter } from 'vue-router';
import { Save, ArrowLeft } from 'lucide-vue-next';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import Input from '../../components/ui/Input.vue';
${hasSelect ? "import Select from '../../components/ui/Select.vue';" : ""}
import Alert from '../../components/ui/Alert.vue';
import { CrudService } from '../../services/crudService';
${hasSelect ? "import { EnumService } from '../../services/enumService';" : ""}

const router = useRouter();
const apiService = new CrudService('${config.endpoint}');

const formData = ref(${JSON.stringify(config.initial, null, 2)});

const alert = ref({ show: false, type: 'success', message: '' });
const isSubmitting = ref(false);

${hasSelect ? `const enums = ref<any>({ ${enumKeys.map(k => `${k}: []`).join(', ')} });
onMounted(async () => {
  try {
    const data = await EnumService.getEnums();
    enums.value = data;
  } catch (e) {
    console.error('Erro ao buscar enums', e);
  }
});` : ''}

const handleSave = async () => {
  isSubmitting.value = true;
  alert.value.show = false;
  try {
    await apiService.create(formData.value);
    alert.value = { show: true, type: 'success', message: '${config.title} criado(a) com sucesso!' };
    setTimeout(() => router.push('/${key}'), 2000);
  } catch (error: any) {
    alert.value = { 
      show: true, 
      type: 'error', 
      message: error.response?.data?.message || 'Erro ao criar registro.' 
    };
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
    <Alert :show="alert.show" :type="alert.type" :message="alert.message" />
    <div class="flex items-center justify-between mb-6">
      <div class="flex gap-2">
        <Button variant="secondary" size="sm" @click="router.push('/${key}')">
          <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
          Voltar
        </Button>
      </div>
    </div>

    <Card>
      <template #header>
        <h2 class="text-lg font-medium text-slate-800">Novo(a) ${config.title}</h2>
      </template>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
${fieldsTemplate}
        </div>
        <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="danger" type="button" @click="router.push('/${key}')">Cancelar</Button>
          <Button variant="primary" type="submit" :disabled="isSubmitting">
            <template #icon><Save class="w-4 h-4 mr-2" /></template>
            Salvar
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>
`;
}

function generateEditContent(key, config) {
  const hasSelect = config.fields.some(f => f.type === 'select');
  const enumKeys = config.fields.filter(f => f.type === 'select').map(f => f.enumKey);
  const fieldsTemplate = config.fields.map(f => {
    if (f.type === 'select') {
      return `          <Select v-model="formData.${f.key}" label="${f.label}" :options="enums.${f.enumKey}" />`;
    }
    return `          <Input v-model="formData.${f.key}" label="${f.label}" type="${f.type}" />`;
  }).join('\n');

  return `<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Save, ArrowLeft } from 'lucide-vue-next';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import Input from '../../components/ui/Input.vue';
${hasSelect ? "import Select from '../../components/ui/Select.vue';" : ""}
import Alert from '../../components/ui/Alert.vue';
import { CrudService } from '../../services/crudService';
${hasSelect ? "import { EnumService } from '../../services/enumService';" : ""}

const router = useRouter();
const route = useRoute();
const apiService = new CrudService('${config.endpoint}');

const formData = ref(${JSON.stringify(config.initial, null, 2)});

const alert = ref({ show: false, type: 'success', message: '' });
const isSubmitting = ref(false);

${hasSelect ? `const enums = ref<any>({ ${enumKeys.map(k => `${k}: []`).join(', ')} });` : ''}

onMounted(async () => {
  try {
${hasSelect ? `    const enumData = await EnumService.getEnums();
    enums.value = enumData;` : ''}
    const data = await apiService.getById(route.params.id as string);
    formData.value = { ...formData.value, ...data };
  } catch (error) {
    alert.value = { show: true, type: 'error', message: 'Erro ao carregar dados.' };
  }
});

const handleSave = async () => {
  isSubmitting.value = true;
  alert.value.show = false;
  try {
    await apiService.update(route.params.id as string, formData.value);
    alert.value = { show: true, type: 'success', message: '${config.title} atualizado(a) com sucesso!' };
    setTimeout(() => router.push('/${key}'), 2000);
  } catch (error: any) {
    alert.value = { 
      show: true, 
      type: 'error', 
      message: error.response?.data?.message || 'Erro ao atualizar registro.' 
    };
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
    <Alert :show="alert.show" :type="alert.type" :message="alert.message" />
    <div class="flex items-center justify-between mb-6">
      <div class="flex gap-2">
        <Button variant="secondary" size="sm" @click="router.push('/${key}')">
          <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
          Voltar
        </Button>
      </div>
    </div>

    <Card>
      <template #header>
        <h2 class="text-lg font-medium text-slate-800">Editar ${config.title}</h2>
      </template>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
${fieldsTemplate}
        </div>
        <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="danger" type="button" @click="router.push('/${key}')">Cancelar</Button>
          <Button variant="primary" type="submit" :disabled="isSubmitting">
            <template #icon><Save class="w-4 h-4 mr-2" /></template>
            Atualizar
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>
`;
}

Object.keys(entities).forEach(key => {
  const config = entities[key];
  const dir = path.join(__dirname, 'src', 'views', key);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(path.join(dir, 'create.vue'), generateCreateContent(key, config));
  fs.writeFileSync(path.join(dir, 'edit.vue'), generateEditContent(key, config));
});

console.log('Views generated successfully!');

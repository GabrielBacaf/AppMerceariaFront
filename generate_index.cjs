const fs = require('fs');
const path = require('path');

const entities = {
  purchases: {
    endpoint: 'purchases', title: 'Compras',
    fields: [
      { key: 'title', label: 'Título' },
      { key: 'status', label: 'Status' }
    ]
  },
  products: {
    endpoint: 'products', title: 'Produtos',
    fields: [
      { key: 'name', label: 'Nome' },
      { key: 'barcode', label: 'Cód. Barras' },
      { key: 'sale_value', label: 'Valor Venda' }
    ]
  },
  clients: {
    endpoint: 'clients', title: 'Clientes',
    fields: [
      { key: 'name', label: 'Nome' },
      { key: 'email', label: 'E-mail' },
      { key: 'phone', label: 'Telefone' }
    ]
  },
  roles: {
    endpoint: 'roles', title: 'Perfis',
    fields: [
      { key: 'name', label: 'Nome' }
    ]
  },
  sales: {
    endpoint: 'sales', title: 'Vendas',
    fields: [
      { key: 'total_value', label: 'Valor Total' }
    ]
  },
  suppliers: {
    endpoint: 'suppliers', title: 'Fornecedores',
    fields: [
      { key: 'fantasy_name', label: 'Nome Fantasia' },
      { key: 'cnpj', label: 'CNPJ' }
    ]
  },
  users: {
    endpoint: 'users', title: 'Usuários',
    fields: [
      { key: 'name', label: 'Nome' },
      { key: 'email', label: 'E-mail' }
    ]
  }
};

function generateIndexContent(key, config) {
  const headers = config.fields.map(f => `              <th scope="col" class="px-6 py-3">${f.label}</th>`).join('\n');
  const cells = config.fields.map(f => `              <td class="px-6 py-4">{{ item.${f.key} }}</td>`).join('\n');

  return `<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import { CrudService } from '../../services/crudService';
import EditButton from '../../components/ui/EditButton.vue';

const router = useRouter();
const apiService = new CrudService('${config.endpoint}');

const data = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await apiService.getAll();
    data.value = Array.isArray(res) ? res : (res.data || []);
    total.value = Array.isArray(res) ? res.length : (res.total || data.value.length);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchData());
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="[{ name: '${config.title}', to: '/${key}' }]" />

    <Card noPadding>
      <template #header>
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-slate-800">Lista de ${config.title}</h1>
          <span v-if="total > 0" class="bg-slate-200 text-slate-700 py-0.5 px-2.5 rounded-full text-sm font-medium">
            {{ total }}
          </span>
        </div>
        <div>
          <Button variant="primary" size="sm" @click="router.push('/${key}/create')">
            <template #icon><Plus class="w-4 h-4 mr-2" /></template>
            Novo(a)
          </Button>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-slate-500">
          <thead class="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" class="px-6 py-3">ID</th>
${headers}
              <th scope="col" class="px-6 py-3 text-right" style="width: 200px">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="100" class="px-6 py-4 text-center text-slate-500">Carregando...</td>
            </tr>
            <tr v-else-if="data.length === 0">
               <td colspan="100" class="px-6 py-4 text-center text-slate-500">Nenhum registro encontrado.</td>
            </tr>
            <tr v-for="item in data" :key="item.id" class="bg-white border-b hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-900">{{ item.id }}</td>
${cells}
              <td class="px-6 py-4 text-right space-x-2">
                <EditButton :to="\`/${key}/\${item.id}/edit\`" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <div class="text-sm text-slate-500 text-center">
          Exibindo {{ data.length }} de {{ total }} registros
        </div>
      </template>
    </Card>
  </div>
</template>
`;
}

Object.keys(entities).forEach(key => {
  const config = entities[key];
  const dir = path.join(__dirname, 'src', 'views', key);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(path.join(dir, 'index.vue'), generateIndexContent(key, config));
});

console.log('Index views generated successfully!');

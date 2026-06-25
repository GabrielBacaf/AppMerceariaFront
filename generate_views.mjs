import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entities = [
  { name: 'users', singularName: 'user', title: 'Usuários', service: 'UserService' },
  { name: 'roles', singularName: 'role', title: 'Papéis', service: 'RoleService' },
  { name: 'products', singularName: 'product', title: 'Produtos', service: 'ProductService' },
  { name: 'purchases', singularName: 'purchase', title: 'Compras', service: 'PurchaseService' },
  { name: 'suppliers', singularName: 'supplier', title: 'Fornecedores', service: 'SupplierService' },
  { name: 'clients', singularName: 'client', title: 'Clientes', service: 'ClientService' },
  { name: 'sales', singularName: 'sale', title: 'Vendas', service: 'SaleService' },
];

const basePath = path.join(__dirname, 'src', 'views');

if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

entities.forEach(entity => {
  const entityPath = path.join(basePath, entity.name);
  if (!fs.existsSync(entityPath)) {
    fs.mkdirSync(entityPath, { recursive: true });
  }

  // index.vue
  fs.writeFileSync(path.join(entityPath, 'index.vue'), `
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Filter from '../../components/crud/Filter.vue';
import List from '../../components/crud/List.vue';
import EditButton from '../../components/ui/EditButton.vue';
import { ${entity.service} } from '../../services';

const breadcrumbItems = [
  { name: '${entity.title}', to: '/${entity.name}' }
];

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Nome', sortable: true }, // Customize conforme a API
];

const data = ref<any[]>([]);
const loading = ref(false);

const fetchData = async (search = '') => {
  loading.value = true;
  try {
    data.value = await ${entity.service}.getAll({ search });
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
    <div class="flex items-center justify-between">
      <Breadcrumb :items="breadcrumbItems" />
      <RouterLink to="/${entity.name}/create" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
        Adicionar Novo
      </RouterLink>
    </div>
    
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-slate-900">${entity.title}</h1>
      <Filter @search="fetchData" placeholder="Buscar ${entity.title.toLowerCase()}..." />
    </div>

    <List :columns="columns" :data="data" :loading="loading">
      <template #actions="{ item }">
        <div class="flex space-x-2 justify-end items-center">
          <RouterLink :to="\`/${entity.name}/\${item.id}\`" class="text-primary-600 hover:text-primary-900 text-sm font-medium mr-2">Ver</RouterLink>
          <EditButton :to="\`/${entity.name}/\${item.id}/edit\`" />
        </div>
      </template>
    </List>
  </div>
</template>
`.trim());

  // show.vue
  fs.writeFileSync(path.join(entityPath, 'show.vue'), `
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Show from '../../components/crud/Show.vue';
import EditButton from '../../components/ui/EditButton.vue';
import { ${entity.service} } from '../../services';

const route = useRoute();
const id = route.params.id as string;

const breadcrumbItems = ref([
  { name: '${entity.title}', to: '/${entity.name}' },
  { name: 'Detalhes' }
]);

const item = ref<any>({});
const schema = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nome' },
  { key: 'created_at', label: 'Criado em' },
];

onMounted(async () => {
  try {
    item.value = await ${entity.service}.getById(id);
    if (breadcrumbItems.value[1]) {
      breadcrumbItems.value[1].name = item.value?.name || \`Detalhes #\${id}\`;
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
      <h1 class="text-2xl font-bold text-slate-900">Detalhes: {{ item?.name || id }}</h1>
    </div>

    <Show title="Informações de ${entity.title}" :item="item" :schema="schema">
      <template #header-actions>
        <EditButton :to="\`/${entity.name}/\${id}/edit\`" />
      </template>
    </Show>
  </div>
</template>
`.trim());

  // create.vue
  fs.writeFileSync(path.join(entityPath, 'create.vue'), `
<script setup lang="ts">
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
// Import form inputs later

const breadcrumbItems = [
  { name: '${entity.title}', to: '/${entity.name}' },
  { name: 'Novo Cadastro' }
];
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    <h1 class="text-2xl font-bold text-slate-900">Novo ${entity.singularName}</h1>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <p class="text-slate-500">Formulário de criação em construção...</p>
    </div>
  </div>
</template>
`.trim());

  // edit.vue
  fs.writeFileSync(path.join(entityPath, 'edit.vue'), `
<script setup lang="ts">
import { useRoute } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';

const route = useRoute();
const id = route.params.id;

const breadcrumbItems = [
  { name: '${entity.title}', to: '/${entity.name}' },
  { name: \`Editar #\${id}\` }
];
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    <h1 class="text-2xl font-bold text-slate-900">Editar ${entity.singularName} #{{ id }}</h1>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <p class="text-slate-500">Formulário de edição em construção...</p>
    </div>
  </div>
</template>
`.trim());
});

console.log('Todas as views base geradas com sucesso!');

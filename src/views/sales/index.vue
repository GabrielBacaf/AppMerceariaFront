<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import { CrudService } from '../../services/crudService';
import EditButton from '../../components/ui/EditButton.vue';
import ShowButton from '../../components/ui/ShowButton.vue';
import FilterCard from '../../components/crud/FilterCard.vue';
import Input from '../../components/ui/Input.vue';
import List from '../../components/crud/List.vue';

const router = useRouter();
const apiService = new CrudService('sales');

const filters = ref({
  search: '',
  date_start: '',
  date_end: '',
  page: 1
});

const handleFilter = () => {
  filters.value.page = 1;
  fetchData();
};

const handleClear = () => {
  filters.value = { search: '', date_start: '', date_end: '', page: 1 };
  fetchData();
};

const handlePageChange = (page: number) => {
  filters.value.page = page;
  fetchData();
};

const data = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);
const pagination = ref<any>(null);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await apiService.getAll(filters.value);
    data.value = Array.isArray(res) ? res : (res.data || []);
    total.value = Array.isArray(res) ? res.length : (res.meta?.total || data.value.length);
    pagination.value = Array.isArray(res) ? null : res.meta;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'total_value', label: 'Valor Total' }
];

onMounted(() => fetchData());
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="[{ name: 'Vendas', to: '/sales' }]" />

    <FilterCard @filter="handleFilter" @clear="handleClear">
      <Input v-model="filters.search" label="Buscar" placeholder="Busca geral..." />
      <Input v-model="filters.date_start" type="date" label="Data Inicial" />
      <Input v-model="filters.date_end" type="date" label="Data Final" />
    </FilterCard>

    <Card noPadding>
      <template #header>
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-slate-800">Lista de Vendas</h1>
          <span v-if="total > 0" class="bg-slate-200 text-slate-700 py-0.5 px-2.5 rounded-full text-sm font-medium">
            {{ total }}
          </span>
        </div>
        <div>
          <Button variant="primary" size="sm" @click="router.push('/sales/create')">
            <template #icon><Plus class="w-4 h-4 mr-2" /></template>
            Novo(a)
          </Button>
        </div>
      </template>

      <List 
        :columns="columns" 
        :data="data" 
        :loading="loading" 
        :pagination="pagination"
        @page-change="handlePageChange"
      >
        <template #actions="{ item }">
          <ShowButton :to="`/sales/${item.id}`" />
          <EditButton :to="`/sales/${item.id}/edit`" />
        </template>
      </List>
    </Card>
  </div>
</template>

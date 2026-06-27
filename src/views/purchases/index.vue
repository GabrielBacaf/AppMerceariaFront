<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import EditButton from '../../components/ui/EditButton.vue';
import ShowButton from '../../components/ui/ShowButton.vue';
import AddProductButton from '../../components/ui/AddProductButton.vue';
import FilterCard from '../../components/crud/FilterCard.vue';
import Input from '../../components/ui/Input.vue';
import List from '../../components/crud/List.vue';
import { useCrudList } from '../../composables/useCrudList';

const router = useRouter();

const {
  filters,
  data,
  total,
  loading,
  pagination,
  handleFilter,
  handleClear,
  handlePageChange
} = useCrudList('purchases', { search: '', date_start: '', date_end: '', page: 1 });

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Título' },
  { key: 'status', label: 'Status' }
];
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="[{ name: 'Compras', to: '/purchases' }]" />

    <FilterCard @filter="handleFilter" @clear="handleClear">
      <Input v-model="filters.search" label="Buscar" placeholder="Título, status..." />
      <Input v-model="filters.date_start" type="date" label="Data Inicial" />
      <Input v-model="filters.date_end" type="date" label="Data Final" />
    </FilterCard>

    <Card noPadding>
      <template #header>
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-slate-800">Lista de Compras</h1>
          <span v-if="total > 0" class="bg-slate-200 text-slate-700 py-0.5 px-2.5 rounded-full text-sm font-medium">
            {{ total }}
          </span>
        </div>
        <div>
          <Button variant="primary" size="sm" @click="router.push('/purchases/create')">
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
          <AddProductButton :to="`/purchases/${item.id}/products`" />
          <ShowButton :to="`/purchases/${item.id}`" />
          <EditButton :to="`/purchases/${item.id}/edit`" />
        </template>
      </List>
    </Card>
  </div>
</template>

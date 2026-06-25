<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Show from '../../components/crud/Show.vue';
import EditButton from '../../components/ui/EditButton.vue';
import { SaleService } from '../../services';

const route = useRoute();
const id = route.params.id as string;

const breadcrumbItems = ref([
  { name: 'Vendas', to: '/sales' },
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
    item.value = await SaleService.getById(id);
    if (breadcrumbItems.value[1]) {
      breadcrumbItems.value[1].name = item.value?.name || `Detalhes #${id}`;
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

    <Show title="Informações de Vendas" :item="item" :schema="schema">
      <template #header-actions>
        <EditButton :to="`/sales/${id}/edit`" />
      </template>
    </Show>
  </div>
</template>
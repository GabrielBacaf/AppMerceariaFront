<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Show from '../../components/crud/Show.vue';
import EditButton from '../../components/ui/EditButton.vue';
import { ClientService } from '../../services';

const route = useRoute();
const id = route.params.id as string;

const breadcrumbItems = ref([
  { name: 'Clientes', to: '/clients' },
  { name: 'Detalhes' }
]);

const item = ref<any>({});
const groups = [
  {
    title: 'Dados Pessoais',
    fields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nome' },
      { key: 'email', label: 'E-mail' },
      { key: 'phone', label: 'Telefone' },
      { key: 'created_at', label: 'Criado em' },
    ]
  },
  {
    title: 'Localização & Endereço',
    fields: [
      { key: 'address.street', label: 'Rua' },
      { key: 'address.number', label: 'Número' },
      { key: 'address.complement', label: 'Complemento' },
      { key: 'address.city', label: 'Cidade' },
      { key: 'address.state', label: 'Estado' },
      { key: 'address.postal_code', label: 'CEP' },
      { key: 'address.country', label: 'País' },
      { key: 'address.latitude', label: 'Latitude' },
      { key: 'address.longitude', label: 'Longitude' },
    ]
  }
];

onMounted(async () => {
  try {
    item.value = await ClientService.getById(id);
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

    <Show :item="item" :groups="groups">
      <template #header-actions>
        <EditButton :to="`/clients/${id}/edit`" />
      </template>
    </Show>
  </div>
</template>
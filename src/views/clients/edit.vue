<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Save, ArrowLeft } from 'lucide-vue-next';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import Input from '../../components/ui/Input.vue';

import { showAlert } from '../../utils/alert';
import { CrudService } from '../../services/crudService';


const router = useRouter();
const breadcrumbItems = [
  { name: 'Clientes', to: '/clients' },
  { name: 'Editar' }
];

const route = useRoute();
const apiService = new CrudService('clients');

const formData = ref({
  "name": "",
  "email": "",
  "phone": "",
  "address": {
    "street": "Rua",
    "number": "123",
    "city": "Cidade",
    "state": "Estado",
    "postal_code": "00000-000",
    "country": "Brasil"
  }
});

const isSubmitting = ref(false);



onMounted(async () => {
  try {

    const data = await apiService.getById(route.params.id as string);
    formData.value = { ...formData.value, ...data };
  } catch (error) {
    showAlert.error('Erro ao carregar dados.');
  }
});

const handleSave = async () => {
  isSubmitting.value = true;
    try {
    await apiService.update(route.params.id as string, formData.value);
    showAlert.success('Cliente atualizado(a) com sucesso!');
    setTimeout(() => router.push('/clients'), 2000);
  } catch (error: any) {
    showAlert.error(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
        

    <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    <Card variant="edit">
      <template #header>
        <h2 class="text-lg font-medium text-slate-800">Editar Cliente</h2>
      </template>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input v-model="formData.name" label="Nome Completo" type="text" />
          <Input v-model="formData.email" label="E-mail" type="email" />
          <Input v-model="formData.phone" label="Telefone" type="text" />
        </div>
        <div class="pt-4 flex justify-between gap-3 border-t border-slate-100">
          <Button type="button" class="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200" @click="router.push('/clients')">
            <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
            Voltar
          </Button>
          <div class="flex gap-3">
          <Button variant="danger" type="button" @click="router.push('/clients')">Cancelar</Button>
          <Button variant="primary" type="submit" :disabled="isSubmitting">
            <template #icon><Save class="w-4 h-4 mr-2" /></template>
            Atualizar
          </Button>
        </div>
        </div>
        </form>
    </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Save, ArrowLeft } from 'lucide-vue-next';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import Input from '../../components/ui/Input.vue';

import { showAlert } from '../../utils/alert';
import { CrudService } from '../../services/crudService';
import api from '../../services/api';

const router = useRouter();
const breadcrumbItems = [
  { name: 'Clientes', to: '/clients' },
  { name: 'Novo' }
];

const apiService = new CrudService('clients');

const formData = ref({
  "name": "",
  "email": "",
  "phone": "",
  "address": {
    "street": "Rua",
    "number": "123",
    "complement": "",
    "city": "Cidade",
    "state": "Estado",
    "postal_code": "00000-000",
    "country": "Brasil",
    "latitude": "",
    "longitude": ""
  }
});
const locationLink = ref('');
const isExtracting = ref(false);

const activeTab = ref('basico');
const clientTabs = ref([
  { id: 'basico', label: 'Dados Básicos', icon: 'fas fa-user' },
  { id: 'endereco', label: 'Endereço', icon: 'fas fa-map-marker-alt' }
]);

const extractLocation = async () => {
  if (!locationLink.value) return;
  const link = locationLink.value;

  isExtracting.value = true;
  try {
    const response = await api.post('/clients/extract-location', { link });
    if (response.data && response.data.latitude && response.data.longitude) {
      formData.value.address.latitude = response.data.latitude;
      formData.value.address.longitude = response.data.longitude;
      
      if (response.data.street) formData.value.address.street = response.data.street;
      if (response.data.number) formData.value.address.number = response.data.number;
      if (response.data.city) formData.value.address.city = response.data.city;
      if (response.data.state) formData.value.address.state = response.data.state;
      if (response.data.postal_code) formData.value.address.postal_code = response.data.postal_code;
      if (response.data.country) formData.value.address.country = response.data.country;

      showAlert.success('Localização e endereço extraídos com sucesso!');
    }
  } catch (error) {
    showAlert.error('Não foi possível extrair a localização desse link. Verifique e tente novamente.');
  } finally {
    isExtracting.value = false;
  }
};

const isSubmitting = ref(false);

const handleSave = async () => {
  isSubmitting.value = true;
  try {
    await apiService.create(formData.value);
    showAlert.success('Cliente criado(a) com sucesso!');
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
      
      <Card variant="create" :tabs="clientTabs" v-model:activeTab="activeTab">
        <form @submit.prevent="handleSave" class="space-y-6">
          
          <!-- Aba: Dados Básicos -->
          <div v-show="activeTab === 'basico'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input v-model="formData.name" label="Nome Completo" type="text" />
            <Input v-model="formData.email" label="E-mail" type="email" />
            <Input v-model="formData.phone" label="Telefone" type="text" />
          </div>

          <!-- Aba: Endereço -->
          <div v-show="activeTab === 'endereco'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input v-model="formData.address.street" label="Rua" type="text" />
            <Input v-model="formData.address.number" label="Número" type="text" />
            <Input v-model="formData.address.complement" label="Complemento" type="text" />
            <Input v-model="formData.address.city" label="Cidade" type="text" />
            <Input v-model="formData.address.state" label="Estado" type="text" />
            <Input v-model="formData.address.postal_code" label="CEP" type="text" />
            <Input v-model="formData.address.country" label="País" type="text" />
            
            <div class="col-span-1 md:col-span-2 border-t border-slate-100 pt-4 mt-2">
              <p class="text-sm text-slate-500 mb-4">Se o cliente enviou a localização pelo WhatsApp, cole o link ou as coordenadas abaixo para preencher automaticamente.</p>
              <div class="flex flex-col gap-2">
                <Input v-model="locationLink" @input="extractLocation" label="Link ou Coordenadas (WhatsApp/Maps)" type="text" placeholder="Cole o link e aguarde a extração..." :disabled="isExtracting" />
                <p v-if="isExtracting" class="text-xs text-blue-500 font-medium animate-pulse">Extraindo localização do link, aguarde...</p>
              </div>
            </div>

            <Input v-model="formData.address.latitude" label="Latitude" type="text" />
            <Input v-model="formData.address.longitude" label="Longitude" type="text" />
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
                Salvar
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

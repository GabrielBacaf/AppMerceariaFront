<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Form from '../../components/crud/Form.vue';
import Input from '../../components/ui/Input.vue';
import { useCrudForm } from '../../composables/useCrudForm';

const route = useRoute();
const breadcrumbItems = [
  { name: 'Clientes', to: '/clients' },
  { name: 'Editar' }
];

const { isSubmitting, handleSave, handleLoad, handleCancel } = useCrudForm('clients', '/clients');

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

onMounted(async () => {
  const data = await handleLoad(route.params.id as string);
  if (data) {
    formData.value = { ...formData.value, ...data };
    if (!formData.value.address) {
       formData.value.address = {
         street: "", number: "", complement: "", city: "", state: "", postal_code: "", country: "", latitude: "", longitude: ""
       };
    }
  }
});

const submit = () => handleSave(formData.value, true, route.params.id as string);
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    
    <Form 
      title="Editar Cliente" 
      :is-submitting="isSubmitting" 
      is-edit
      @submit="submit" 
      @cancel="handleCancel"
    >
      <Input v-model="formData.name" label="Nome Completo" type="text" />
      <Input v-model="formData.email" label="E-mail" type="email" />
      <Input v-model="formData.phone" label="Telefone" type="text" />
      <Input v-model="formData.address.street" label="Rua" type="text" />
      <Input v-model="formData.address.number" label="Número" type="text" />
      <Input v-model="formData.address.complement" label="Complemento" type="text" />
      <Input v-model="formData.address.city" label="Cidade" type="text" />
      <Input v-model="formData.address.state" label="Estado" type="text" />
      <Input v-model="formData.address.postal_code" label="CEP" type="text" />
      <Input v-model="formData.address.country" label="País" type="text" />
      <Input v-model="formData.address.latitude" label="Latitude" type="text" />
      <Input v-model="formData.address.longitude" label="Longitude" type="text" />
    </Form>
  </div>
</template>

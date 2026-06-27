<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Form from '../../components/crud/Form.vue';
import Input from '../../components/ui/Input.vue';
import { useCrudForm } from '../../composables/useCrudForm';

const route = useRoute();
const breadcrumbItems = [
  { name: 'Fornecedores', to: '/suppliers' },
  { name: 'Editar' }
];

const { isSubmitting, handleSave, handleLoad, handleCancel } = useCrudForm('suppliers', '/suppliers');

const formData = ref({
  fantasy_name: "",
  legal_name: "",
  cnpj: ""
});

onMounted(async () => {
  const data = await handleLoad(route.params.id as string);
  if (data) {
    formData.value = { ...formData.value, ...data };
  }
});

const submit = () => handleSave(formData.value, true, route.params.id as string);
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    
    <Form 
      title="Editar Fornecedor" 
      :is-submitting="isSubmitting" 
      is-edit
      @submit="submit" 
      @cancel="handleCancel"
    >
      <Input v-model="formData.fantasy_name" label="Nome Fantasia" type="text" />
      <Input v-model="formData.legal_name" label="Razão Social" type="text" />
      <Input v-model="formData.cnpj" label="CNPJ" type="text" />
    </Form>
  </div>
</template>

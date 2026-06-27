<script setup lang="ts">
import { ref } from 'vue';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Form from '../../components/crud/Form.vue';
import Input from '../../components/ui/Input.vue';
import { useCrudForm } from '../../composables/useCrudForm';

const breadcrumbItems = [
  { name: 'Fornecedores', to: '/suppliers' },
  { name: 'Novo' }
];

const { isSubmitting, handleSave, handleCancel } = useCrudForm('suppliers', '/suppliers');

const formData = ref({
  fantasy_name: "",
  legal_name: "",
  cnpj: ""
});

const submit = () => handleSave(formData.value);
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    
    <Form 
      title="Novo(a) Fornecedor" 
      :is-submitting="isSubmitting" 
      @submit="submit" 
      @cancel="handleCancel"
    >
      <Input v-model="formData.fantasy_name" label="Nome Fantasia" type="text" />
      <Input v-model="formData.legal_name" label="Razão Social" type="text" />
      <Input v-model="formData.cnpj" label="CNPJ" type="text" />
    </Form>
  </div>
</template>

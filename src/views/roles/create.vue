<script setup lang="ts">
import { ref } from 'vue';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Form from '../../components/crud/Form.vue';
import Input from '../../components/ui/Input.vue';
import { useCrudForm } from '../../composables/useCrudForm';

const breadcrumbItems = [
  { name: 'Perfis', to: '/roles' },
  { name: 'Novo' }
];

const { isSubmitting, handleSave, handleCancel } = useCrudForm('roles', '/roles');

const formData = ref({
  name: "",
  permissions: []
});

const submit = () => handleSave(formData.value);
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    
    <Form 
      title="Novo(a) Perfil/Role" 
      :is-submitting="isSubmitting" 
      @submit="submit" 
      @cancel="handleCancel"
    >
      <Input v-model="formData.name" label="Nome do Perfil" type="text" />
    </Form>
  </div>
</template>

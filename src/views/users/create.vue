<script setup lang="ts">
import { ref } from 'vue';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Form from '../../components/crud/Form.vue';
import Input from '../../components/ui/Input.vue';
import { useCrudForm } from '../../composables/useCrudForm';

const breadcrumbItems = [
  { name: 'Usuários', to: '/users' },
  { name: 'Novo' }
];

const { isSubmitting, handleSave, handleCancel } = useCrudForm('users', '/users');

const formData = ref({
  name: "",
  login: "",
  email: "",
  password: "",
  password_confirmation: "",
  status: "ativo",
  roles: []
});

const submit = () => handleSave(formData.value);
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="breadcrumbItems" />
    
    <Form 
      title="Novo(a) Usuário" 
      :is-submitting="isSubmitting" 
      @submit="submit" 
      @cancel="handleCancel"
    >
      <Input v-model="formData.name" label="Nome" type="text" />
      <Input v-model="formData.login" label="Login" type="text" />
      <Input v-model="formData.email" label="E-mail" type="email" />
      <Input v-model="formData.password" label="Senha" type="password" />
      <Input v-model="formData.password_confirmation" label="Confirmação de Senha" type="password" />
      <Input v-model="formData.status" label="Status" type="text" />
    </Form>
  </div>
</template>

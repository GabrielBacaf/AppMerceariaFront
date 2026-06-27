<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Form from '../../components/crud/Form.vue';
import Input from '../../components/ui/Input.vue';
import { useCrudForm } from '../../composables/useCrudForm';

const route = useRoute();
const breadcrumbItems = [
  { name: 'Usuários', to: '/users' },
  { name: 'Editar' }
];

const { isSubmitting, handleSave, handleLoad, handleCancel } = useCrudForm('users', '/users');

const formData = ref({
  name: "",
  login: "",
  email: "",
  password: "",
  password_confirmation: "",
  status: "ativo",
  roles: []
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
      title="Editar Usuário" 
      :is-submitting="isSubmitting" 
      is-edit
      @submit="submit" 
      @cancel="handleCancel"
    >
      <Input v-model="formData.name" label="Nome" type="text" />
      <Input v-model="formData.login" label="Login" type="text" />
      <Input v-model="formData.email" label="E-mail" type="email" />
      <Input v-model="formData.password" label="Senha (deixe em branco para não alterar)" type="password" />
      <Input v-model="formData.password_confirmation" label="Confirmação de Senha" type="password" />
      <Input v-model="formData.status" label="Status" type="text" />
    </Form>
  </div>
</template>

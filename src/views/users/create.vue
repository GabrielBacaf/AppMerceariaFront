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


const router = useRouter();
const breadcrumbItems = [
  { name: 'Usuários', to: '/users' },
  { name: 'Novo' }
];

const apiService = new CrudService('users');

const formData = ref({
  "name": "",
  "login": "",
  "email": "",
  "password": "",
  "password_confirmation": "",
  "status": "ativo",
  "roles": []
});

const isSubmitting = ref(false);



const handleSave = async () => {
  isSubmitting.value = true;
    try {
    await apiService.create(formData.value);
    showAlert.success('Usuário criado(a) com sucesso!');
    setTimeout(() => router.push('/users'), 2000);
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
    <Card variant="create">
      <template #header>
        <h2 class="text-lg font-medium text-slate-800">Novo(a) Usuário</h2>
      </template>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input v-model="formData.name" label="Nome" type="text" />
          <Input v-model="formData.login" label="Login" type="text" />
          <Input v-model="formData.email" label="E-mail" type="email" />
          <Input v-model="formData.password" label="Senha" type="password" />
          <Input v-model="formData.password_confirmation" label="Confirmação de Senha" type="password" />
          <Input v-model="formData.status" label="Status" type="text" />
        </div>
        <div class="pt-4 flex justify-between gap-3 border-t border-slate-100">
          <Button type="button" class="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200" @click="router.push('/users')">
            <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
            Voltar
          </Button>
          <div class="flex gap-3">
          <Button variant="danger" type="button" @click="router.push('/users')">Cancelar</Button>
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

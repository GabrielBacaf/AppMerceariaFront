<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Save, ArrowLeft } from 'lucide-vue-next';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import Input from '../../components/ui/Input.vue';

import { showAlert } from '../../utils/alert';
import { CrudService } from '../../services/crudService';


const router = useRouter();
const route = useRoute();
const apiService = new CrudService('users');

const formData = ref({
  "name": "",
  "login": "",
  "email": "",
  "password": "",
  "password_confirmation": "",
  "roles": []
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
    showAlert.success('Usuário atualizado(a) com sucesso!');
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
        <div class="flex items-center justify-between mb-6">
      <div class="flex gap-2">
        <Button variant="secondary" size="sm" @click="router.push('/users')">
          <template #icon><ArrowLeft class="w-4 h-4 mr-2" /></template>
          Voltar
        </Button>
      </div>
    </div>

    <Card>
      <template #header>
        <h2 class="text-lg font-medium text-slate-800">Editar Usuário</h2>
      </template>

      <form @submit.prevent="handleSave" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input v-model="formData.name" label="Nome" type="text" />
          <Input v-model="formData.login" label="Login" type="text" />
          <Input v-model="formData.email" label="E-mail" type="email" />
          <Input v-model="formData.password" label="Senha" type="password" />
          <Input v-model="formData.password_confirmation" label="Confirmação de Senha" type="password" />
        </div>
        <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button variant="danger" type="button" @click="router.push('/users')">Cancelar</Button>
          <Button variant="primary" type="submit" :disabled="isSubmitting">
            <template #icon><Save class="w-4 h-4 mr-2" /></template>
            Atualizar
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

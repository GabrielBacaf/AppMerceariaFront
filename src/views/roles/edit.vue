<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Form from '../../components/crud/Form.vue';
import Input from '../../components/ui/Input.vue';
import { useCrudForm } from '../../composables/useCrudForm';

const route = useRoute();
const breadcrumbItems = [
  { name: 'Perfis', to: '/roles' },
  { name: 'Editar' }
];

const { isSubmitting, handleSave, handleLoad, handleCancel } = useCrudForm('roles', '/roles');

const formData = ref({
  name: "",
  permissions: []
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
      title="Editar Perfil/Role" 
      :is-submitting="isSubmitting" 
      is-edit
      @submit="submit" 
      @cancel="handleCancel"
    >
      <Input v-model="formData.name" label="Nome do Perfil" type="text" />
    </Form>
  </div>
</template>

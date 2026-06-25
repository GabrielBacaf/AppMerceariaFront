<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import Breadcrumb from '../../components/ui/Breadcrumb.vue';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';
import { CrudService } from '../../services/crudService';
import EditButton from '../../components/ui/EditButton.vue';
import ShowButton from '../../components/ui/ShowButton.vue';

const router = useRouter();
const apiService = new CrudService('users');

const data = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await apiService.getAll();
    data.value = Array.isArray(res) ? res : (res.data || []);
    total.value = Array.isArray(res) ? res.length : (res.total || data.value.length);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchData());
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb :items="[{ name: 'Usuários', to: '/users' }]" />

    <Card noPadding>
      <template #header>
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-slate-800">Lista de Usuários</h1>
          <span v-if="total > 0" class="bg-slate-200 text-slate-700 py-0.5 px-2.5 rounded-full text-sm font-medium">
            {{ total }}
          </span>
        </div>
        <div>
          <Button variant="primary" size="sm" @click="router.push('/users/create')">
            <template #icon><Plus class="w-4 h-4 mr-2" /></template>
            Novo(a)
          </Button>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-slate-500">
          <thead class="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" class="px-6 py-3">ID</th>
              <th scope="col" class="px-6 py-3">Nome</th>
              <th scope="col" class="px-6 py-3">E-mail</th>
              <th scope="col" class="px-6 py-3 text-right" style="width: 200px">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="100" class="px-6 py-4 text-center text-slate-500">Carregando...</td>
            </tr>
            <tr v-else-if="data.length === 0">
               <td colspan="100" class="px-6 py-4 text-center text-slate-500">Nenhum registro encontrado.</td>
            </tr>
            <tr v-for="item in data" :key="item.id" class="bg-white border-b hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-900">{{ item.id }}</td>
              <td class="px-6 py-4">{{ item.name }}</td>
              <td class="px-6 py-4">{{ item.email }}</td>
              <td class="px-6 py-4 text-right space-x-2">
                <ShowButton :to="`/users/${item.id}`" />
                <EditButton :to="`/users/${item.id}/edit`" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <div class="text-sm text-slate-500 text-center">
          Exibindo {{ data.length }} de {{ total }} registros
        </div>
      </template>
    </Card>
  </div>
</template>

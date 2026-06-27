import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { CrudService } from '../services/crudService';
import { showAlert } from '../utils/alert';

export function useCrudForm<T = any>(endpoint: string, redirectRoute: string) {
  const router = useRouter();
  const apiService = new CrudService(endpoint);

  const isSubmitting = ref(false);

  const handleSave = async (formData: T, isEdit = false, id?: string | number, successMessage?: string) => {
    isSubmitting.value = true;
    try {
      if (isEdit && id) {
        await apiService.update(id, formData);
      } else {
        await apiService.create(formData);
      }
      showAlert.success(successMessage || `Registro ${isEdit ? 'atualizado' : 'criado'} com sucesso!`);
      setTimeout(() => router.push(redirectRoute), 2000);
    } catch (error: any) {
      showAlert.error(error);
    } finally {
      isSubmitting.value = false;
    }
  };

  const handleLoad = async (id: string | number) => {
    try {
      const data = await apiService.getById(id);
      return data;
    } catch (error) {
      showAlert.error('Erro ao carregar dados.');
      return null;
    }
  };

  const handleCancel = () => {
    router.push(redirectRoute);
  };

  return {
    isSubmitting,
    handleSave,
    handleLoad,
    handleCancel,
    router
  };
}

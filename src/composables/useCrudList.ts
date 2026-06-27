import { ref, onMounted } from 'vue';
import { CrudService } from '../services/crudService';

export function useCrudList<T = any>(endpoint: string, initialFilters: any = { search: '', page: 1 }) {
  const apiService = new CrudService(endpoint);

  const filters = ref({ ...initialFilters });

  const data = ref<T[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const pagination = ref<any>(null);

  const fetchData = async () => {
    loading.value = true;
    try {
      const res = await apiService.getAll(filters.value);
      data.value = Array.isArray(res) ? res : (res.data || []);
      total.value = Array.isArray(res) ? res.length : (res.meta?.total || data.value.length);
      pagination.value = Array.isArray(res) ? null : res.meta;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const handleFilter = () => {
    filters.value.page = 1;
    fetchData();
  };

  const handleClear = () => {
    filters.value = { ...initialFilters };
    fetchData();
  };

  const handlePageChange = (page: number) => {
    filters.value.page = page;
    fetchData();
  };

  onMounted(() => fetchData());

  return {
    filters,
    data,
    total,
    loading,
    pagination,
    fetchData,
    handleFilter,
    handleClear,
    handlePageChange
  };
}

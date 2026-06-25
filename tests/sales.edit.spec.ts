import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { showAlert } from '../src/utils/alert';
vi.mock('../src/utils/alert', () => ({ showAlert: { success: vi.fn(), error: vi.fn() } }));
import EditView from '../src/views/sales/edit.vue';

// Mock Router
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ params: { id: '1' } })
}));

// Mock API Service
vi.mock('../src/services/crudService', () => {
  return {
    CrudService: class {
      create = vi.fn();
      getById = vi.fn().mockResolvedValue({ id: 1 });
      getAll = vi.fn().mockResolvedValue([]);
      update = vi.fn().mockResolvedValue({ id: 1 });
    }
  };
});

// Mock EnumService
vi.mock('../src/services/enumService', () => {
  return {
    EnumService: {
      getEnums: vi.fn().mockResolvedValue({ categories: [], statuses: [] })
    }
  };
});

describe('Venda Edit View', () => {
  it('should load data and submit successfully', async () => {
    const wrapper = mount(EditView);
    
    // Wait for onMounted data load
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Simulate submit
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(showAlert.success).toHaveBeenCalled();
  });
});

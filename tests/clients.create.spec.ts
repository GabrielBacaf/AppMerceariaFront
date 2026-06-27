import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { showAlert } from '../src/utils/alert';
vi.mock('../src/utils/alert', () => ({ showAlert: { success: vi.fn(), error: vi.fn() } }));
import CreateView from '../src/views/clients/create.vue';

// Mock Router
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn() }),
    useRoute: () => ({ params: {} })
  }
});

// Mock API Service
vi.mock('../src/services/crudService', () => {
  return {
    CrudService: class {
      create = vi.fn().mockResolvedValue({ id: 1 });
      getById = vi.fn().mockResolvedValue({ id: 1 });
      getAll = vi.fn().mockResolvedValue([]);
      update = vi.fn();
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

describe('Cliente Create View', () => {
  it('should render form and submit successfully', async () => {
    const wrapper = mount(CreateView);
    
    // Wait for onMounted enum load
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Simulate submit
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(showAlert.success).toHaveBeenCalled();
  });
});

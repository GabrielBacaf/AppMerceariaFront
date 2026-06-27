import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { showAlert } from '../src/utils/alert';
vi.mock('../src/utils/alert', () => ({ showAlert: { success: vi.fn(), error: vi.fn() } }));
import CreateView from '../src/views/sales/create.vue';

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

describe('Venda Create View', () => {
  it('should render view successfully', async () => {
    const wrapper = mount(CreateView);
    
    // Wait for onMounted enum load
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(wrapper.exists()).toBe(true);
  });
});

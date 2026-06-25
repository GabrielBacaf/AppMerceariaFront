const fs = require('fs');
const path = require('path');

const entities = {
  purchases: { endpoint: 'purchases', title: 'Compra' },
  products: { endpoint: 'products', title: 'Produto' },
  clients: { endpoint: 'clients', title: 'Cliente' },
  roles: { endpoint: 'roles', title: 'Perfil/Role' },
  sales: { endpoint: 'sales', title: 'Venda' },
  suppliers: { endpoint: 'suppliers', title: 'Fornecedor' },
  users: { endpoint: 'users', title: 'Usuário' },
};

function generateCreateTest(key, config) {
  return `import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { showAlert } from '../src/utils/alert';
vi.mock('../src/utils/alert', () => ({ showAlert: { success: vi.fn(), error: vi.fn() } }));
import CreateView from '../src/views/${key}/create.vue';

// Mock Router
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ params: {} })
}));

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

describe('${config.title} Create View', () => {
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
`;
}

function generateEditTest(key, config) {
  return `import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { showAlert } from '../src/utils/alert';
vi.mock('../src/utils/alert', () => ({ showAlert: { success: vi.fn(), error: vi.fn() } }));
import EditView from '../src/views/${key}/edit.vue';

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

describe('${config.title} Edit View', () => {
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
`;
}

const testsDir = path.join(__dirname, 'tests');
if (!fs.existsSync(testsDir)) fs.mkdirSync(testsDir, { recursive: true });

Object.keys(entities).forEach(key => {
  const config = entities[key];
  fs.writeFileSync(path.join(testsDir, key + '.create.spec.ts'), generateCreateTest(key, config));
  fs.writeFileSync(path.join(testsDir, key + '.edit.spec.ts'), generateEditTest(key, config));
});

console.log('Tests generated successfully!');

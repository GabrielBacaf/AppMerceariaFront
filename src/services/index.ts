import { CrudService } from './crudService';
import api from './api';

// Auth
export const AuthService = {
  login: async (credentials: any) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  }
};

// CRUD Services
export const UserService = new CrudService('users');
export const RoleService = new CrudService('roles');
export const ProductService = new CrudService('products');
export const PurchaseService = new CrudService('purchases');
export const SupplierService = new CrudService('suppliers');
export const ClientService = new CrudService('clients');
export const SaleService = new CrudService('sales');

export const PermissionService = {
  getAll: async () => {
    const response = await api.get('/permissions');
    return response.data.data ? response.data.data : response.data;
  }
};

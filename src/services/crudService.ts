import api from './api';

export class CrudService<T = any, CreateDTO = any, UpdateDTO = any> {
  constructor(public resource: string) {}

  async getAll(params?: Record<string, any>): Promise<T[]> {
    const response = await api.get(`/${this.resource}`, { params });
    // Laravel API resources usually wrap collections in a 'data' property
    return response.data.data ? response.data.data : response.data;
  }

  async getById(id: string | number): Promise<T> {
    const response = await api.get(`/${this.resource}/${id}`);
    return response.data.data ? response.data.data : response.data;
  }

  async create(data: CreateDTO): Promise<T> {
    const response = await api.post(`/${this.resource}`, data);
    return response.data.data ? response.data.data : response.data;
  }

  async update(id: string | number, data: UpdateDTO): Promise<T> {
    const response = await api.put(`/${this.resource}/${id}`, data);
    return response.data.data ? response.data.data : response.data;
  }

  async delete(id: string | number): Promise<any> {
    const response = await api.delete(`/${this.resource}/${id}`);
    return response.data;
  }
}

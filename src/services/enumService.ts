import api from './api';

export class EnumService {
  static async getEnums() {
    const response = await api.get('/enums');
    const data = response.data;
    const mapped: any = {};
    for (const key in data) {
      mapped[key] = data[key].map((item: any) => ({
        name: item.value,
        value: item.value
      }));
    }
    return mapped;
  }
}

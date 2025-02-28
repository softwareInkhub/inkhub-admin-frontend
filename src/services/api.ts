import { endpoints } from '../config/api';

export class ApiService {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll() {
    const response = await fetch(this.endpoint);
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  }

  async getById(id: string) {
    const response = await fetch(`${this.endpoint}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  }

  async create(data: any) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create data');
    return response.json();
  }

  async update(id: string, data: any) {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) throw new Error('Failed to update data');
    return response.json();
  }

  async delete(id: string) {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete data');
    return response.json();
  }
}

export const usersApi = new ApiService(endpoints.users);
export const productsApi = new ApiService(endpoints.products);
export const tasksApi = new ApiService(endpoints.tasks); 
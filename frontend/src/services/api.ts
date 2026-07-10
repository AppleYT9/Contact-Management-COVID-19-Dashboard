import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginAPI = async (email: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);
  
  const response = await api.post('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const registerAPI = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getContactsAPI = async (search?: string) => {
  const response = await api.get('/contacts/', {
    params: search ? { search } : {},
  });
  return response.data;
};

export const createContactAPI = async (contactData: any) => {
  const response = await api.post('/contacts/', contactData);
  return response.data;
};

export const updateContactAPI = async (id: number, contactData: any) => {
  const response = await api.put(`/contacts/${id}`, contactData);
  return response.data;
};

export const deleteContactAPI = async (id: number) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

export default api;

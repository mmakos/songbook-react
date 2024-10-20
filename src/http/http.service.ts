import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${apiUrl}/`,
});

export const HttpService = {
  get: (url: string, params?: object) => api.get(url, { params: params }),
  getExternal: (url: string) => axios.get(url),
};

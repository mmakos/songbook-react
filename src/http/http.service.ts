import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${apiUrl}/`,
});

export const HttpService = {
  get: (url: string) => api.get(url),
  getExternal: (url: string) => axios.get(url),
};

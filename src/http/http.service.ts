import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const api: axios.Axios = axios.create({
  baseURL: `${apiUrl}/`,
});

export const HttpService = {
  get: (url: string) => api.request({ url, method: 'GET' }),
  post: (url: string, body: unknown, headers?: object) =>
    api.request({
      url,
      method: 'POST',
      data: body,
      headers: headers ?? {
        'Content-Type': 'application/json',
      },
    }),
  put: (url: string, body: unknown) => api.request({ url, method: 'PUT', data: body }),
  delete: (url: string) => api.request({ url, method: 'DELETE' }),
};

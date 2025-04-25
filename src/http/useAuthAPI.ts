import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { api } from './api.ts';
import { setAccessToken } from '../store/songbook.reducer.ts';

const useAuthAPI = () => {
  const accessToken = useAppSelector((state) => state.accessToken);
  const dispatch = useAppDispatch();

  const refreshToken = async () => {
    const response = await api.post('auth/refresh/', undefined, { withCredentials: true });
    dispatch(setAccessToken(response.data.access));
    return response.data.access;
  };

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization'] && accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error: unknown) => Promise.reject(error)
    );

    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        const url = error?.config.url;
        if (error?.response?.status === 401 && !prevRequest?.sent && url !== 'auth/refresh/') {
          prevRequest.sent = true;
          const newAccessToken = await refreshToken();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken]);

  return { authAPI: api, accessToken };
};

export default useAuthAPI;

import { createContext, PropsWithChildren, useContext, useMemo, useRef } from 'react';
import { AxiosInstance } from 'axios';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { api } from './api.ts';
import { setAccessToken } from '../store/songbook.reducer.ts';

const AuthApiContextComponent = (): AxiosInstance => {
  const accessToken = useAppSelector((state) => state.accessToken);
  const dispatch = useAppDispatch();
  const interceptors = useRef<[number, number]>();

  const refreshToken = async () => {
    const response = await api.post('auth/refresh/', undefined, { withCredentials: true });
    dispatch(setAccessToken(response.data.access));
    return response.data.access;
  };

  useMemo(() => {
    if (interceptors.current) {
      api.interceptors.request.eject(interceptors.current[0]);
      api.interceptors.response.eject(interceptors.current[1]);
    }

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

    interceptors.current = [requestIntercept, responseIntercept];
  }, [accessToken]);

  return api;
};

export const AuthApiContext = createContext(undefined as unknown as AxiosInstance);

export const AuthApiContextProvider = ({ children }: PropsWithChildren) => {
  return <AuthApiContext.Provider value={AuthApiContextComponent()}>{children}</AuthApiContext.Provider>;
};

export const useAuthAPI = () => useContext(AuthApiContext);

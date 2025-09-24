import { createContext, PropsWithChildren, useContext, useMemo, useRef } from 'react';
import { AxiosInstance } from 'axios';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { api } from './api.ts';
import { setAccessToken } from '../store/songbook.reducer.ts';

const AuthApiContextComponent = (): AxiosInstance => {
  const accessToken = useAppSelector((state) => state.accessToken);
  const dispatch = useAppDispatch();
  const interceptors = useRef<[number, number]>();
  const refreshing = useRef(false);
  const failedQueue = useRef<{ resolve: (token: string) => void; reject: (error: unknown) => void }[]>([]);

  const refreshToken = async () => {
    const response = await api.post('auth/refresh/', undefined, { withCredentials: true });
    dispatch(setAccessToken(response.data.access));
    return response.data.access;
  };

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.current.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });
    failedQueue.current = [];
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
        const originalRequest = error?.config;
        const url = error?.config.url;

        if (error?.response?.status === 401 && !originalRequest?._retry && url !== 'auth/refresh/') {
          if (refreshing.current) {
            return new Promise((resolve, reject) => {
              failedQueue.current.push({
                resolve: (token: string) => {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`;
                  resolve(api(originalRequest));
                },
                reject,
              });
            });
          }

          originalRequest._retry = true;
          refreshing.current = true;

          try {
            const newToken = await refreshToken();
            processQueue(null, newToken);
            originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
            return api(originalRequest);
          } catch (err) {
            processQueue(err, null);
            return Promise.reject(err);
          } finally {
            refreshing.current = false;
          }
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

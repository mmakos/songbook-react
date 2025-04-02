import {useEffect, useRef} from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { api } from '../http/api.ts';
import { notifyError, setAccessToken, setUser } from '../store/songbook.reducer.ts';
import { useAppDispatch } from '../store/songbook.store.ts';
import { AxiosResponse } from 'axios';
import { ILoginResponse, mapResponseToUser } from './user.types.ts';

const LoginResult = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { source } = useParams();
  const codeRef = useRef(searchParams.get('code'));  // Zapobieganie strict mode na development

  useEffect(() => {
    if (codeRef.current) {
      api
        .post(`auth/login/${source}/`, { code: codeRef.current }, { withCredentials: true })
        .then((res: AxiosResponse<ILoginResponse>) => {
          dispatch(setAccessToken(res.data.access));
          dispatch(setUser(mapResponseToUser(res.data.user)));
          navigate('/account');
        })
        .catch(() => {
          dispatch(notifyError(`Nie udało się zalogować kontem ${source}`));
          navigate('/login');
        });
      codeRef.current = null;
    }
  }, []);

  return <></>;
};

export default LoginResult;

import { useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { api } from '../http/api.ts';
import { notifyError, setAccessToken, setUser } from '../store/songbook.reducer.ts';
import { useAppDispatch } from '../store/songbook.store.ts';
import {AxiosError, AxiosResponse} from 'axios';
import { ILoginResponse, mapResponseToUser } from './user.types.ts';

const LoginResult = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { source } = useParams();
  const codeRef = useRef(searchParams.get('code')); // Zapobieganie strict mode na development

  useEffect(() => {
    if (codeRef.current) {
      api
        .post(`auth/login/${source}/`, { code: codeRef.current }, { withCredentials: true })
        .then((res: AxiosResponse<ILoginResponse>) => {
          dispatch(setAccessToken(res.data.access));
          dispatch(setUser(mapResponseToUser(res.data.user)));
          navigate('/account');
        })
        .catch((e: AxiosError<{ non_field_errors?: string[] }>) => {
          const data = e.response?.data?.non_field_errors;
          if (data?.length && data[0].includes("e-mail")) {
            dispatch(notifyError("Użytkownik z takim adresem email już istnieje. " +
                "Prawdopodobnie zalogowałeś się już wcześniej przy pomocy innego konta społecznościowego."));
          } else {
            dispatch(notifyError(`Nie udało się zalogować kontem ${source}`));
          }
          navigate('/login');
        });
      codeRef.current = null;
    }
  }, []);

  return <></>;
};

export default LoginResult;

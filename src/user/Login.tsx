import { Button, Divider, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import GithubLogin from './social/GithubLogin.tsx';
import GoogleLogin from './social/GoogleLogin.tsx';
import FacebookLogin from './social/FacebookLogin.tsx';
import XLogin from './social/XLogin.tsx';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Key, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import { api } from '../http/api.ts';
import { AxiosResponse } from 'axios';
import { ILoginResponse } from './user.types.ts';
import { notifyError, setAccessToken, setUser } from '../store/songbook.reducer.ts';
import { useNavigate } from 'react-router';

const Login = () => {
  const user = useAppSelector((state) => state.user);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (user === undefined) return;
  if (user) return <Navigate to="/account" />;

  const handleLogin = () => {
    api
      .post(`auth/login/`, { username, password }, {withCredentials: true})
      .then((res: AxiosResponse<ILoginResponse>) => {
        dispatch(setAccessToken(res.data.access));
        dispatch(setUser(res.data.user));
        navigate('/account');
      })
      .catch(() => {
        dispatch(notifyError(`Niepoprawna nazwa użytkownika lub hasło`));
      });
  };

  return (
    <Stack justifyContent="center" spacing={2}>
      <GoogleLogin />
      <GithubLogin />
      <FacebookLogin />
      <XLogin />
      <Divider>lub</Divider>
      <TextField
        label="Nazwa użytkownika lub email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        label="Hasło"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Key />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Button variant="contained" onClick={handleLogin} disabled={!username || !password}>
        Zaloguj
      </Button>
    </Stack>
  );
};

export default Login;

import { Stack, Typography } from '@mui/material';
import GithubLogin from './social/GithubLogin.tsx';
import GoogleLogin from './social/GoogleLogin.tsx';
import FacebookLogin from './social/FacebookLogin.tsx';
import XLogin from './social/XLogin.tsx';
import { useAppSelector } from '../store/songbook.store.ts';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const user = useAppSelector((state) => state.user);
  if (user === undefined) return;
  if (user) return <Navigate to="/account" />;

  return (
    <Stack justifyContent="center" spacing={2}>
      <GoogleLogin />
      <GithubLogin />
      <Typography variant="caption" color="error">Tu niestety coś się zchrzaniło</Typography>
      <XLogin />
      <FacebookLogin />
    </Stack>
  );
};

export default Login;

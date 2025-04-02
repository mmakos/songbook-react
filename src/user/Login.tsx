import { Stack } from '@mui/material';
import GithubLogin from './social/GithubLogin.tsx';
import GoogleLogin from './social/GoogleLogin.tsx';
import FacebookLogin from './social/FacebookLogin.tsx';
import InstagramLogin from './social/InstagramLogin.tsx';
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
      <XLogin />
      <FacebookLogin />
      <InstagramLogin />
    </Stack>
  );
};

export default Login;

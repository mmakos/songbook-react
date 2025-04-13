import { X as XTwitter } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';

const CLIENT_ID = import.meta.env.VITE_X_CLIENT_ID;

const XLogin = () => {
  const xLogin = () => {
    window.location.assign(
      `https://x.com/i/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=users.email users.read&code_challenge=challenge&code_challenge_method=plain&redirect_uri=${window.location.origin}/login/x&state=abcdefgh`
    );
  };

  return (
    <Stack>
      <Button onClick={() => xLogin()} startIcon={<XTwitter />} size="large" variant="outlined">
        Zaloguj z kontem X
      </Button>
      <Typography variant="caption" color="error">
        To raczej nie zadziała (coś nie tak z X)
      </Typography>
    </Stack>
  );
};

export default XLogin;

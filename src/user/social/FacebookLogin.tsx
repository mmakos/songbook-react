import { Button } from '@mui/material';
import { Facebook } from '@mui/icons-material';

const CLIENT_ID = import.meta.env.VITE_FACEBOOK_CLIENT_ID;

const FacebookLogin = () => {
  const facebookLogin = () => {
    window.location.assign(`https://www.facebook.com/v22.0/dialog/oauth?client_id=${CLIENT_ID}&scope=email&response_type=code&redirect_uri=${window.location.origin}/login/facebook`);
  };

  return (
    <Button onClick={() => facebookLogin()} startIcon={<Facebook />} size="large" variant='outlined'>
      Zaloguj z kontem Facebook
    </Button>
  );
};

export default FacebookLogin;

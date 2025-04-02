import { Button } from '@mui/material';
import { Google } from '@mui/icons-material';

const CLIENT_ID = '452813825360-bfofpierh0mq150mohjp9ecfbmtenolb.apps.googleusercontent.com';

const GoogleLogin = () => {
  const googleLogin = () => {
    window.location.assign(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=code&scope=profile email&redirect_uri=${window.location.origin}/login/google`
    );
  };

  return (
    <Button onClick={() => googleLogin()} startIcon={<Google />} size="large" variant='outlined'>
      Zaloguj z kontem Google
    </Button>
  );
};

export default GoogleLogin;

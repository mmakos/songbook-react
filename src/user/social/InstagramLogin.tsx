import { Button } from '@mui/material';
import { Instagram } from '@mui/icons-material';

const CLIENT_ID = '602325082617244';

const InstagramLogin = () => {
  const instagramLogin = () => {
    window.location.assign(
      `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&scope=user_profile&redirect_uri=${window.location.origin}/login/instagram`
    );
  };

  return (
    <Button onClick={() => instagramLogin()} startIcon={<Instagram />} size="large" variant="outlined">
      Zaloguj z kontem Instagram
    </Button>
  );
};

export default InstagramLogin;

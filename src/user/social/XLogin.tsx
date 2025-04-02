import { X as XTwitter } from '@mui/icons-material';
import { Button } from '@mui/material';

const CLIENT_ID = 'THJRVGFnenpiMER3WVR3VUpkWFI6MTpjaQ';

const XLogin = () => {
  const xLogin = () => {
    window.location.assign(
      `https://x.com/i/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=users.email&code_challenge=challenge&code_challenge_method=plain&redirect_uri=${window.location.origin}/login/x&state=abcdefgh`
    );
  };

  return (
    <Button onClick={() => xLogin()} startIcon={<XTwitter />} size="large" variant="outlined">
      Zaloguj z kontem X
    </Button>
  );
};

export default XLogin;

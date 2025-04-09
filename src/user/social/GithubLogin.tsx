import { Button } from '@mui/material';
import { GitHub } from '@mui/icons-material';

const CLIENT_ID = 'Ov23liRxVNKs0uPC6dGS';

const GithubLogin = () => {
  const githubLogin = () => {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user:email`);
  };

  return (
    <Button onClick={() => githubLogin()} startIcon={<GitHub />} size="large" variant="outlined">
      Zaloguj z kontem Github
    </Button>
  );
};

export default GithubLogin;

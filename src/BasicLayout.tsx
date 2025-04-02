import MainMenu from './main-menu/MainMenu.tsx';
import { Container, Divider, Stack } from '@mui/material';
import CopyrightInfo from './footer/CopyrightInfo.tsx';
import { Outlet } from 'react-router-dom';

const BasicLayout = () => {
  return (
    <Stack minHeight="100vh">
      <MainMenu />
      <Container sx={{ flexGrow: 1, mt: '1em', display: 'flex', justifyContent: 'center' }}>
        <Outlet />
      </Container>
      <footer>
        <Divider sx={{ mt: '0.7em' }} />
        <CopyrightInfo />
      </footer>
    </Stack>
  );
};

export default BasicLayout;

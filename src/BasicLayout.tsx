import MainMenu from './main-menu/MainMenu.tsx';
import { Container, Divider } from '@mui/material';
import CopyrightInfo from './footer/CopyrightInfo.tsx';
import { Outlet } from 'react-router-dom';

const BasicLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MainMenu />
      <Container sx={{ flexGrow: 1, mt: '1em', display: 'flex', justifyContent: 'center' }}>
        <Outlet />
      </Container>
      <footer>
        <Divider sx={{ mt: '0.7em' }} />
        <CopyrightInfo />
      </footer>
    </div>
  );
};

export default BasicLayout;

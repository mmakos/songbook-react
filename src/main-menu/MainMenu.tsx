import { AppBar, Container, IconButton, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Search from './Search.tsx';
import { useNavigate } from 'react-router-dom';
import { SettingsIcon } from '../components/SettingsIcon.tsx';
import AppBarMenu from './AppBarMenu.tsx';
import DrawerMenu from './DrawerMenu.tsx';

const MainMenu = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {downMd ? <DrawerMenu /> : <AppBarMenu />}
          <Search />
          <IconButton onClick={() => navigate('settings/')} color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainMenu;

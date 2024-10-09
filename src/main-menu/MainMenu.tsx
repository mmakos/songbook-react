import { AppBar, Box, Container, IconButton, Toolbar } from '@mui/material';
import MainMenuButton from '../components/MainMenuButton.tsx';
import SongsMenu from './SongsMenu.tsx';
import ExtrasMenu from './ExtrasMenu.tsx';
import { Call, Home } from '@mui/icons-material';
import Search from './Search.tsx';
import { useNavigate } from 'react-router-dom';
import { SettingsIcon } from '../components/SettingsIcon.tsx';

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <MainMenuButton name={'Strona główna'} icon={<Home />} routeTo="/" />
            <SongsMenu />
            <ExtrasMenu />
            <MainMenuButton name={'Kontakt'} icon={<Call />} />
          </Box>
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

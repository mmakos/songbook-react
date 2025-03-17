import { AppBar, Container, IconButton, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SettingsIcon } from '../components/SettingsIcon.tsx';
import AppBarMenu from './AppBarMenu.tsx';
import DrawerMenu from './DrawerMenu.tsx';
import Search from '../search/Search.tsx';
import RandomSong from '../song/RandomSong.tsx';
import UserMenu from '../user/UserMenu.tsx';

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
          <RandomSong />
          <IconButton onClick={() => navigate('settings/')} color="inherit">
            <SettingsIcon />
          </IconButton>
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainMenu;

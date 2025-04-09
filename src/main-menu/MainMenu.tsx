import { AppBar, Container, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { SettingsIcon } from '../components/SettingsIcon.tsx';
import AppBarMenu from './AppBarMenu.tsx';
import DrawerMenu from './DrawerMenu.tsx';
import Search from '../search/Search.tsx';
import RandomSong from '../song/RandomSong.tsx';
import RouteIconButton from '../components/RouteIconButton.tsx';

const MainMenu = () => {
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {downMd ? <DrawerMenu /> : <AppBarMenu />}
          <Search />
          <RandomSong />
          <RouteIconButton to="/settings" color="inherit">
            <SettingsIcon />
          </RouteIconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainMenu;

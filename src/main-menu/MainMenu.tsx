import { AppBar, Box, Container, Toolbar } from '@mui/material';
import MainMenuButton from '../components/MainMenuButton.tsx';
import SongsMenu from './SongsMenu.tsx';
import ExtrasMenu from './ExtrasMenu.tsx';
import { Call, Home } from '@mui/icons-material';
import Search from './Search.tsx';
import ThemeSwitch from '../components/ThemeSwitch.tsx';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { changeTheme } from '../store/songbook.reducer.ts';

const MainMenu = () => {
  const theme = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

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
          <ThemeSwitch
            checked={theme === 'dark'}
            onChange={(_, value) => dispatch(changeTheme(value ? 'dark' : 'light'))}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainMenu;

import { CssBaseline, Divider, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from './theme.ts';
import Notification from './notification/Notification.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainMenu from './main-menu/MainMenu.tsx';
import SongList from './song-list/SongList.tsx';
import Song from './song/Song.tsx';
import CopyrightInfo from './footer/CopyrightInfo.tsx';
import { useAppSelector } from './store/songbook.store.ts';
import Settings from './settings/Settings.tsx';
import Person from './author/Person.tsx';
import Band from './author/Band.tsx';
import Source from './author/Source.tsx';

const StoreApp = () => {
  const theme = useAppSelector((state) => state.theme);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <Notification />
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <MainMenu />
          <div style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Routes>
                <Route path="/songs/:category?" element={<SongList />} />
                <Route path="/song/:songSlug" element={<Song />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/person/:personSlug" element={<Person />} />
                <Route path="/band/:bandSlug" element={<Band />} />
                <Route path="/source/:sourceSlug" element={<Source />} />
              </Routes>
            </div>
          </div>
          <footer>
            <Divider sx={{ mt: '0.5em' }} />
            <CopyrightInfo />
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default StoreApp;

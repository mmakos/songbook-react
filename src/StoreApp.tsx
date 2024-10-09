import { CssBaseline, Divider, Theme, ThemeProvider, useMediaQuery } from '@mui/material';
import { darkTheme, lightTheme } from './theme.ts';
import Notification from './notification/Notification.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainMenu from './main-menu/MainMenu.tsx';
import CopyrightInfo from './footer/CopyrightInfo.tsx';
import { useAppSelector } from './store/songbook.store.ts';
import { lazy, useMemo } from 'react';
import NotFound from './subsites/NotFound.tsx';

import SongList from './song-list/SongList.tsx';
import Song from './song/Song.tsx';
import Settings from './settings/Settings.tsx';
import Person from './author/Person.tsx';
import Band from './author/Band.tsx';
import Source from './author/Source.tsx';

// const SongList = lazy(() => import('./song-list/SongList.tsx'));
// const Song = lazy(() => import('./song/Song.tsx'));
// const Settings = lazy(() => import('./settings/Settings.tsx'));
// const Person = lazy(() => import('./author/Person.tsx'));
// const Band = lazy(() => import('./author/Band.tsx'));
// const Source = lazy(() => import('./author/Source.tsx'));

const StoreApp = () => {
  const preferredTheme = useAppSelector((state) => state.theme);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme: Theme = useMemo(() => {
    if (preferredTheme) {
      return preferredTheme === 'dark' ? darkTheme : lightTheme;
    } else {
      return prefersDarkMode ? darkTheme : lightTheme;
    }
  }, [preferredTheme, prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
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
                <Route path="*" element={<NotFound />} />
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

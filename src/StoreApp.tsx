import { CssBaseline, Theme, useMediaQuery } from '@mui/material';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { darkTheme, lightTheme } from './theme.ts';
import Notification from './notification/Notification.tsx';
import { Route } from 'react-router';
import { useAppSelector } from './store/songbook.store.ts';
import { useMemo } from 'react';
import NotFound from './subsites/NotFound.tsx';
import Settings from './settings/Settings.tsx';
import Person from './author/Person.tsx';
import Band from './author/Band.tsx';
import Source from './author/Source.tsx';
import SongFullTable from './song-list/SongFullTable.tsx';
import FullSearch from './search/FullSearch.tsx';
import MainPage from './subsites/MainPage.tsx';
import LogIn from './user/LogIn.tsx';
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import BasicLayout from './BasicLayout.tsx';
import SongEdit from './editor/SongEdit.tsx';
import GlobalSong from './song/GlobalSong.tsx';
import CircleOfFifths from './circle-of-fifths/CircleOfFifths.tsx';
import KeyPlayground from "./circle-of-fifths/KeyPlayground.tsx";

// const SongList = lazy(() => import('./song-list/SongList.tsx'));
// const Song = lazy(() => import('./song/Song.tsx'));
// const Settings = lazy(() => import('./settings/Settings.tsx'));
// const Person = lazy(() => import('./author/Person.tsx'));
// const Band = lazy(() => import('./author/Band.tsx'));
// const Source = lazy(() => import('./author/Source.tsx'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<BasicLayout />}>
      <Route path="/" element={<MainPage />} />
      <Route path="/songs/:category?" element={<SongFullTable />} />
      <Route path="/song/:songSlug" element={<GlobalSong />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/person/:personSlug" element={<Person />} />
      <Route path="/band/:bandSlug" element={<Band />} />
      <Route path="/source/:sourceSlug" element={<Source />} />
      <Route path="/search" element={<FullSearch />} />
      <Route path="/edit/:songSlug" element={<SongEdit />} />
      <Route path="/edit-info" element={<SongEdit />} />
      <Route path="/circle" element={<KeyPlayground />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

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
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default StoreApp;

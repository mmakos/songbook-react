import { CssBaseline, Theme, useMediaQuery } from '@mui/material';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { darkTheme, lightTheme } from './theme.ts';
import Notification from './notification/Notification.tsx';
import { Route } from 'react-router';
import { useAppDispatch, useAppSelector } from './store/songbook.store.ts';
import { useEffect, useMemo } from 'react';
import NotFound from './subsites/NotFound.tsx';
import Settings from './settings/Settings.tsx';
import Person from './author/Person.tsx';
import Band from './author/Band.tsx';
import Source from './author/Source.tsx';
import SongFullTable from './song-list/SongFullTable.tsx';
import FullSearch from './search/FullSearch.tsx';
import MainPage from './subsites/MainPage.tsx';
import Login from './user/Login.tsx';
import { createBrowserRouter, createRoutesFromElements, Navigate, RouterProvider } from 'react-router-dom';
import BasicLayout from './BasicLayout.tsx';
import SongEdit from './editor/SongEdit.tsx';
import GlobalSong from './song/GlobalSong.tsx';
import PersonEdit from './editor/person/PersonEdit.tsx';
import BandEdit from './editor/band/BandEdit.tsx';
import SourceEdit from './editor/source/SourceEdit.tsx';
import LoginResult from './user/LoginResult.tsx';
import AccountInfo from './user/AccountInfo.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import useAuthAPI from './http/useAuthAPI.ts';
import { AxiosResponse } from 'axios';
import { IUser, UserType } from './user/user.types.ts';
import { setUser } from './store/songbook.reducer.ts';
import VerifyBand from './verify/VerifyBand.tsx';
import VerifySource from './verify/VerifySource.tsx';
import VerifyPerson from './verify/VerifyPerson.tsx';
import SongAdd from './editor/SongAdd.tsx';
import VerifySong from './verify/VerifySong.tsx';
import RedirectSong from './song/RedirectSong.tsx';
import CreateMeeting from './meeting/CreateMeeting.tsx';
import EditMeeting from './meeting/EditMeeting.tsx';
import Meeting from './meeting/Meeting.tsx';
import MyMeetings from './meeting/MyMeetings.tsx';
import CurrentMeeting from './meeting/CurrentMeeting.tsx';
import JoinMeeting from './meeting/JoinMeeting.tsx';

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
      <Route path="/settings" element={<Settings />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/:source" element={<LoginResult />} />
      <Route path="/song/:songSlug/:username?" element={<GlobalSong />} />
      <Route path="/person/:personSlug/:username?" element={<Person />} />
      <Route path="/band/:bandSlug/:username?" element={<Band />} />
      <Route path="/source/:sourceSlug/:username?" element={<Source />} />
      <Route path="/search" element={<FullSearch />} />

      <Route path="/meeting/:meetingId" element={<Meeting />} />
      <Route path="/meeting" element={<CurrentMeeting />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<AccountInfo />} />
        <Route path="/add/song" element={<SongAdd />} />
        <Route path="/edit/song/:songSlug/:username?" element={<SongEdit />} />
        <Route path="/edit/person/:personSlug/:username?" element={<PersonEdit />} />
        <Route path="/edit/band/:bandSlug/:username?" element={<BandEdit />} />
        <Route path="/edit/source/:sourceSlug/:username?" element={<SourceEdit />} />

        <Route path="/add/meeting" element={<CreateMeeting />} />
        <Route path="/edit/meeting/:meetingId" element={<EditMeeting />} />
        <Route path="/meetings" element={<MyMeetings />} />
        <Route path="/join/meeting/id/:meetingId" element={<JoinMeeting />} />
        <Route path="/join/meeting/:accessCode" element={<JoinMeeting />} />
      </Route>
      <Route element={<ProtectedRoute types={[UserType.SITH, UserType.JEDI]} />}>
        <Route path="/verify/band/:slug" element={<VerifyBand />} />
        <Route path="/verify/person/:slug" element={<VerifyPerson />} />
        <Route path="/verify/source/:slug" element={<VerifySource />} />
        <Route path="/verify/song/:songSlug/:username" element={<VerifySong />} />
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/piosenki" element={<Navigate to="/songs" replace />} />
      <Route path="/piosenki/wszystkie" element={<Navigate to="/songs" replace />} />
      <Route path="/piosenki/kaczmarski" element={<Navigate to="/songs/kaczmarski" replace />} />
      <Route path="/piosenki/obozowe" element={<Navigate to="/songs/other" replace />} />
      <Route path="/piosenki/patriotyczne" element={<Navigate to="/songs/patriotic" replace />} />
      <Route path="/piosenki/religijne" element={<Navigate to="/songs/religious" replace />} />
      <Route path="/piosenki/koledy" element={<Navigate to="/songs/carols" replace />} />
      <Route path="/piosenki/:category/:title" element={<RedirectSong />} />
    </Route>
  )
);

const StoreApp = () => {
  const preferredTheme = useAppSelector((state) => state.theme);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { authAPI } = useAuthAPI();
  const dispatch = useAppDispatch();

  useEffect(() => {
    authAPI
      .get('auth/account/')
      .then((response: AxiosResponse<IUser>) => dispatch(setUser(response.data)))
      .catch(() => dispatch(setUser(null)));
  }, []);

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

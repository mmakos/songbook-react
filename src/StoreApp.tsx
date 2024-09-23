import { CssBaseline, Divider, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from './theme.ts';
import Notification from './notification/Notification.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainMenu from './main-menu/MainMenu.tsx';
import SongList from './song-list/SongList.tsx';
import Song from './song/Song.tsx';
import CopyrightInfo from './footer/CopyrightInfo.tsx';
import { useAppSelector } from './store/songbook.store.ts';

const StoreApp = () => {
  const theme = useAppSelector((state) => state.theme);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <Notification />
      <BrowserRouter>
        <MainMenu />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Routes>
            <Route path="/songs" element={<SongList />} />
            <Route path="/songs/:songId" element={<Song />} />
          </Routes>
        </div>
        <Divider sx={{ mt: '0.5em' }} />
        <CopyrightInfo />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default StoreApp;

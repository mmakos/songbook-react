import { useAppSelector } from './songbook.store.ts';
import { darkTheme, lightTheme } from '../theme.ts';
import { Theme } from '@mui/material';

const useSongTheme = (): Theme => {
  const mode = useAppSelector((state) => state.songbookSettings.songTheme.mode);

  return mode === 'light' ? lightTheme : darkTheme;
};

export default useSongTheme;

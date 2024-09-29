import { useTheme } from '@mui/material';
import { useAppSelector } from './songbook.store.ts';

const useLineHeight = (): number => {
  const theme = useTheme();
  const songLineHeight = useAppSelector((state) => state.songbookSettings.songTheme.spacing.lineHeight);
  const customSpacing = useAppSelector((state) => state.songbookSettings.songTheme.customSpacing);
  return customSpacing ? songLineHeight : theme.typography.body1.lineHeight as number;
};

export default useLineHeight;

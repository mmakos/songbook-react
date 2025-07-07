import { useTheme } from '@mui/material';
import { useSongContext } from '../song/SongContext.tsx';

const useLineHeight = (): number => {
  const theme = useTheme();
  const { spacing } = useSongContext();

  return spacing ? spacing.lineHeight : (theme.typography.body1.lineHeight as number);
};

export default useLineHeight;

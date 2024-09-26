import { useTheme } from '@mui/material';
import { useAppSelector } from '../../store/songbook.store.ts';

const EmptyLine = () => {
  const theme = useTheme();
  const songLineHeight = useAppSelector(state => state.songTheme.font?.lineHeight);
  const lineHeight = songLineHeight ?? theme.typography.body1.lineHeight;

  return <div style={{ height: `calc(1em * ${lineHeight})` }} />;
};

export default EmptyLine;

import SongText from './text/SongText.tsx';
import { Collapse, Skeleton, Stack, useTheme } from '@mui/material';
import SongChords from './chord/SongChords.tsx';
import { useAppSelector } from '../store/songbook.store.ts';
import { darkTheme, lightTheme } from '../theme.ts';

const SongContent = () => {
  const song = useAppSelector((state) => state.song);
  const showChords = useAppSelector((state) => state.songSettings.showChords);
  const noChords = useAppSelector((state) => state.songbookSettings.noChords);
  const theme = useTheme();
  const appThemeMode = useAppSelector((state) => state.theme);
  const { mode, font } = useAppSelector((state) => state.songTheme);
  const songTheme = mode && (mode === appThemeMode ? undefined : mode === 'light' ? lightTheme : darkTheme);

  return (
    <div
      style={{
        padding: '1.5em 2em 1em 2em',
        display: 'flex',
        whiteSpace: 'nowrap',
        color: songTheme?.palette.text.primary,
        background: songTheme?.palette.background.default,
        lineHeight: font ? `${font.lineHeight}em` : (theme.typography.body1.lineHeight as string),
        fontFamily: font?.fontFamily ?? theme.typography.fontFamily,
        fontSize: font ? `${font.fontSize}px` : (theme.typography.body1.fontSize as string),
        fontWeight: font?.bold ? 'bold' : 'normal',
        fontStyle: font?.italic ? 'italic' : 'normal',
        textDecoration: font?.underline ? 'underline' : 'none',
        borderRadius: '4px 4px 0 0',
      }}
    >
      {song ? (
        <>
          <SongText song={song} />
          {!noChords && (
            <Collapse in={showChords} orientation="horizontal">
              <SongChords song={song} />
            </Collapse>
          )}
        </>
      ) : (
        <Stack spacing={1}>
          <Skeleton height="7em" width="20em" variant="rounded"></Skeleton>
          <Skeleton height="4em" width="20em" variant="rounded"></Skeleton>
          <Skeleton height="7em" width="20em" variant="rounded"></Skeleton>
          <Skeleton height="4em" width="20em" variant="rounded"></Skeleton>
          <Skeleton height="7em" width="20em" variant="rounded"></Skeleton>
          <Skeleton height="4em" width="20em" variant="rounded"></Skeleton>
        </Stack>
      )}
    </div>
  );
};

export default SongContent;

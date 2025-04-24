import { FC } from 'react';
import { Divider, Paper, Skeleton, Stack } from '@mui/material';
import SongInfo from './SongInfo.tsx';
import { useAppSelector } from '../store/songbook.store.ts';
import EditorInfo from './EditorInfo.tsx';
import SongTitle from './SongTitle.tsx';
import SongSettings from './SongSettings.tsx';
import SongRoute from './SongRoute.tsx';
import SongContent from './SongContent.tsx';
import SongVideo from './SongVideo.tsx';
import SongControls from './SongControls.tsx';
import { ISong } from '../types/song.types.ts';
import WaitingEditsInfo from './WaitingEditsInfo.tsx';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import useSongTheme from '../store/useSongTheme.ts';
import GlobalMeeting from '../meeting/GlobalMeeting.tsx';

const Song: FC<{ song?: ISong; preview?: boolean }> = ({ song, preview }) => {
  const noChords = useAppSelector((state) => state.songbookSettings.noChordInfo);
  const songTheme = useSongTheme();

  return (
    <div style={{ position: 'relative', alignItems: 'center', maxWidth: '100%' }}>
      <SongTitle song={song} />
      <SongRoute song={song} />
      <div
        style={{
          marginBottom: '0.5em',
          display: 'flex',
          flexWrap: 'nowrap',
          overflow: 'auto',
          gap: '0.5em',
          scrollbarWidth: 'none',
        }}
      >
        <SongControls type="chip" preview={preview} />
      </div>
      <Stack direction={{xs: 'column', lg: 'row'}} spacing={1} useFlexGap>
        <Stack direction="column" spacing={1}>
          <SongInfo song={song} />
          <SongVideo song={song} />
          {!noChords && <SongSettings song={song} />}
          <Paper>
            <ThemeProvider theme={songTheme}>
              <SongContent song={song} />
            </ThemeProvider>
            <Divider variant="middle" />
            <Stack padding="0.5em 1em">
              {song ? <EditorInfo prefix="Utworzono" editorInfo={song.created} /> : <Skeleton />}
              {song?.edited && <EditorInfo prefix="Edytowano" editorInfo={song.edited} />}
              {song && <WaitingEditsInfo waiting={song} routeTo={`/song/${song.slug}`} />}
            </Stack>
          </Paper>
        </Stack>
        {!preview && <GlobalMeeting />}
      </Stack>
    </div>
  );
};

export default Song;

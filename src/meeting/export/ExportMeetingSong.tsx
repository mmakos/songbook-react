import { IMeetingExportSong } from '../meeting.types.tsx';
import { FC, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import SongContent from '../../song/SongContent.tsx';
import useSongTheme from '../../store/useSongTheme.ts';
import SongChordSettings from '../../song/SongChordSettings.tsx';
import { ExpandMore } from '@mui/icons-material';
import { useExportMeetingContext } from './ExportMeetingContext.tsx';
import { IChordDifficulty } from '../../store/songbook.reducer.ts';
import useRerender from '../../components/useRerender.ts';
import { ExportMeetingSongContextProvider } from './ExportMeetingSongContext.tsx';

interface IExportMeetingSongProps {
  song: IMeetingExportSong;
  expanded?: boolean;
  setExpanded: (expand: boolean) => void;
}

const ExportMeetingSong: FC<IExportMeetingSongProps> = ({ song, expanded, setExpanded }) => {
  const {
    chordDifficulty: meetingChordDifficulty,
    showChords: meetingShowChords,
    fetchSong,
  } = useExportMeetingContext();
  const [moreSettings, setMoreSettings] = useState(false);
  const rerender = useRerender();
  const songTheme = useSongTheme();

  const handleExpand = (expand: boolean) => {
    setExpanded(expand);
    if (expand && !song.fullSong) {
      fetchSong(song);
    }
  };

  const changeChordDifficulty = (difficulty?: IChordDifficulty) => {
    if (difficulty) {
      const refDifficulty = song.chordDifficulty ?? meetingChordDifficulty;
      song.chordDifficulty = { ...refDifficulty, ...difficulty };
    } else {
      delete song.chordDifficulty;
    }
    rerender();
  };

  const changeShowChords = (showChords?: boolean) => {
    song.showChords = showChords;
    rerender();
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, expand) => handleExpand(expand)}
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6">{song.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1}>
          {song.fullSong && (
            <Stack>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!song.chordDifficulty}
                    onChange={(_, value) => {
                      changeChordDifficulty(value ? {} : undefined);
                      changeShowChords(value ? meetingShowChords : undefined);
                    }}
                  />
                }
                label="Inne ustawienia dla tej piosenki"
              />
              <SongChordSettings
                song={song.fullSong}
                moreSettings={moreSettings}
                setMoreSettings={setMoreSettings}
                showChords={song.showChords ?? meetingShowChords}
                setShowChords={changeShowChords}
                transposition={song.transposition ?? { amount: 0 }}
                transposeDown={() => {}}
                transposeUp={() => {}}
                resetTransposition={() => {}}
                chordDifficulty={song.chordDifficulty ?? meetingChordDifficulty}
                changeChordDifficulty={(difficulty) => changeChordDifficulty(difficulty)}
                disabled={!song.chordDifficulty}
              />
            </Stack>
          )}
          <Divider />
          <ThemeProvider theme={songTheme}>
            <ExportMeetingSongContextProvider song={song}>
              <SongContent song={song.fullSong} preview />
            </ExportMeetingSongContextProvider>
          </ThemeProvider>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default ExportMeetingSong;

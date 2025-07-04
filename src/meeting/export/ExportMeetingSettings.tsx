import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import FontChooser from '../../components/font/FontChooser.tsx';
import FontSpacing from '../../components/font/FontSpacing.tsx';
import FontStyles from '../../components/font/FontStyles.tsx';
import ChordStyle from '../../settings/chord/ChordStyle.tsx';
import ChordDifficultyPreset from '../../settings/chord/ChordDifficultyPreset.tsx';
import ChordDifficulty from '../../settings/chord/ChordDifficulty.tsx';
import TextSettings from '../../settings/song/TextSettings.tsx';
import { ExpandMore } from '@mui/icons-material';
import { useExportMeetingContext } from './ExportMeetingContext.tsx';
import ExportAuthorsSettings from './ExportAuthorsSettings.tsx';

const ExportMeetingSettings = () => {
  const {
    font,
    setFont,
    spacing,
    setSpacing,
    fontStyles,
    setFontStyles,
    textSettings,
    setTextSettings,
    showChords,
    setShowChords,
    chordDifficulty,
    setChordDifficulty,
  } = useExportMeetingContext();

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Czcionka i odstępy</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FontChooser value={font} onChange={setFont} maxWidth="40ch" pt />
            <FontSpacing spacing={spacing} setSpacing={(spacing) => setSpacing(spacing)} maxWidth="40ch" />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Style tekstu i akordów</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            <FontStyles styles={fontStyles} setStyles={setFontStyles} maxWidth="40ch" />
            <ChordStyle fontStyles={fontStyles} setFontStyles={setFontStyles} maxWidth="40ch" />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Tekst piosenki</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextSettings textSettings={textSettings} setTextSettings={setTextSettings} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Wyświetlanie autorów</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ExportAuthorsSettings />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Ustawienia akordów</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <div>
              <FormControlLabel
                control={<Switch checked={showChords} onChange={(_, value) => setShowChords(value)} />}
                label="Pokaż akordy"
              />
            </div>
            <ChordDifficultyPreset
              chordDifficulty={chordDifficulty}
              changeDifficulty={setChordDifficulty}
              showDescription
              disabled={!showChords}
            />
            <ChordDifficulty
              chordDifficulty={chordDifficulty}
              changeDifficulty={(diff) => setChordDifficulty({ ...chordDifficulty, ...diff })}
              disabled={!showChords}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ExportMeetingSettings;

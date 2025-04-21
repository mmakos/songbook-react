import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import { useOptionalSongEditContext } from './SongEditContext.tsx';
import SongInfoEditor from './info/SongInfoEditor.tsx';
import SongEditor from './text/SongEditor.tsx';
import SongDependentsEditor from './info/SongDependentsEditor.tsx';
import SongEditSummary from './summary/SongEditSummary.tsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import ReactRouterPrompt from 'react-router-prompt';
import AlertTransition from '../components/AlertTransition.tsx';
import NotFound from '../subsites/NotFound.tsx';
import Progress from '../components/Progress.tsx';
import ImportSong from "./import-song/ImportSong.tsx";

const SongEditStepper = () => {
  const { activeStep, needsAuthorEdit, song, songEdit, songTimeout, canExit, newSong } = useOptionalSongEditContext();

  if (!newSong && (song === undefined || !songEdit)) {
    if (songTimeout) {
      return <NotFound />;
    } else {
      return <Progress />;
    }
  }

  const stepFromInfo = newSong ? activeStep - 1 : activeStep;

  return (
    <Stack gap={2} width="100%">
      <ReactRouterPrompt when={!canExit}>
        {({ isActive, onConfirm, onCancel }: { isActive: boolean; onConfirm: () => void; onCancel: () => void }) => (
          <Dialog open={isActive} TransitionComponent={AlertTransition}>
            <DialogTitle>Opuszczanie strony</DialogTitle>
            <DialogContent>
              Czy na pewno chcesz opuścić stronę bez zapisania piosenki? Wszystkie zmiany w piosence zostaną utracone!
            </DialogContent>
            <DialogActions>
              <Button onClick={onCancel} variant="contained">
                Zostań na stronie
              </Button>
              <Button onClick={onConfirm} variant="outlined">
                Opuść stronę
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </ReactRouterPrompt>
      <Stepper activeStep={activeStep}>
        {newSong && (
          <Step>
            <StepLabel>Importuj</StepLabel>
          </Step>
        )}
        <Step>
          <StepLabel>Informacje o piosence</StepLabel>
        </Step>
        {needsAuthorEdit && (
          <Step>
            <StepLabel>Autorzy, zespoły i źródła</StepLabel>
          </Step>
        )}
        <Step>
          <StepLabel>Tekst i akordy</StepLabel>
        </Step>
        <Step>
          <StepLabel>Podsumowanie</StepLabel>
        </Step>
      </Stepper>
      {stepFromInfo === -1 && <ImportSong />}
      {stepFromInfo === 0 && <SongInfoEditor />}
      {needsAuthorEdit && stepFromInfo === 1 && <SongDependentsEditor />}
      {stepFromInfo === (needsAuthorEdit ? 2 : 1) && <SongEditor />}
      {stepFromInfo === (needsAuthorEdit ? 3 : 2) && <SongEditSummary />}
    </Stack>
  );
};

export default SongEditStepper;

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
  Typography,
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

const SongEditStepper = () => {
  const { activeStep, needsAuthorEdit, song, songEdit, songTimeout } = useOptionalSongEditContext();

  if (!song || !songEdit) {
    if (songTimeout) {
      return <NotFound />;
    } else {
      return <Progress />;
    }
  }

  return (
    <Stack gap={2} width="100%">
      <ReactRouterPrompt when={true}>
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

      <Typography color="error">
        Uwaga! To jest rozwojowy feature. Możesz przetestować, ale i tak nie będziesz w stanie zaktualizować piosenki na
        serwerze, dopóki nie dorobię zarządzania użytkownikami.
      </Typography>
      <Stepper activeStep={activeStep} nonLinear>
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
      {activeStep === 0 && <SongInfoEditor />}
      {needsAuthorEdit && activeStep === 1 && <SongDependentsEditor />}
      {activeStep === (needsAuthorEdit ? 2 : 1) && <SongEditor />}
      {activeStep === (needsAuthorEdit ? 3 : 2) && <SongEditSummary />}
    </Stack>
  );
};

export default SongEditStepper;

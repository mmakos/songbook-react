import { Step, StepLabel, Stepper } from '@mui/material';
import { SongEditStep, useSongEditContext } from './SongEditContext.tsx';
import SongInfoEditor from './info/SongInfoEditor.tsx';

const SongEditStepper = () => {
  const { activeStep } = useSongEditContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', width: '100%' }}>
      <Stepper activeStep={activeStep} nonLinear>
        <Step>
          <StepLabel>Informacje o piosence</StepLabel>
        </Step>
        <Step>
          <StepLabel>Autorzy, zespoły i źródła</StepLabel>
        </Step>
        <Step>
          <StepLabel>Tekst i akordy</StepLabel>
        </Step>
      </Stepper>
      {activeStep === SongEditStep.INFO && <SongInfoEditor />}
    </div>
  );
};

export default SongEditStepper;

import { SongEditContextProvider } from './SongEditContext.tsx';
import SongEditStepper from './SongEditStepper.tsx';

const SongEdit = () => {
  return (
    <SongEditContextProvider>
      <SongEditStepper />
    </SongEditContextProvider>
  );
};

export default SongEdit;

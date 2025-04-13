import { SongEditContextProvider } from './SongEditContext.tsx';
import SongEditStepper from './SongEditStepper.tsx';

const SongEdit = () => {
  return (
    <SongEditContextProvider newSong={true}>
      <SongEditStepper />
    </SongEditContextProvider>
  );
};

export default SongEdit;

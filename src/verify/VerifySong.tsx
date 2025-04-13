import { SongEditContextProvider } from '../editor/SongEditContext.tsx';
import SongEditStepper from '../editor/SongEditStepper.tsx';

const VerifySong = () => {
  return (
    <SongEditContextProvider newSong={false} verification>
      <SongEditStepper />
    </SongEditContextProvider>
  );
};

export default VerifySong;

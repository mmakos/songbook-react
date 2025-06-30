import { SongEditContextProvider } from '../editor/SongEditContext.tsx';
import SongEditStepper from '../editor/SongEditStepper.tsx';
import BasicHelmet from '../subsites/BasicHelmet.tsx';

const VerifySong = () => {
  return (
    <SongEditContextProvider newSong={false} verification>
      <BasicHelmet title="Weryfikacja piosenki" />
      <SongEditStepper />
    </SongEditContextProvider>
  );
};

export default VerifySong;

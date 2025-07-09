import { SongEditContextProvider } from '../editor/SongEditContext.tsx';
import BasicHelmet from '../subsites/BasicHelmet.tsx';
import { lazy } from 'react';

const SongEditStepper = lazy(() => import('../editor/SongEditStepper.tsx'));

const VerifySong = () => {
  return (
    <SongEditContextProvider newSong={false} verification>
      <BasicHelmet title="Weryfikacja piosenki" />
      <SongEditStepper />
    </SongEditContextProvider>
  );
};

export default VerifySong;

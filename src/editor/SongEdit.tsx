import { SongEditContextProvider } from './SongEditContext.tsx';
import BasicHelmet from '../subsites/BasicHelmet.tsx';
import { lazy } from 'react';

const SongEditStepper = lazy(() => import('./SongEditStepper.tsx'));

const SongEdit = () => {
  return (
    <SongEditContextProvider newSong={false}>
      <BasicHelmet title="Edycja piosenki" />
      <SongEditStepper />
    </SongEditContextProvider>
  );
};

export default SongEdit;

import { SongEditContextProvider } from './SongEditContext.tsx';
import BasicHelmet from '../subsites/BasicHelmet.tsx';
import { lazy } from 'react';

const SongEditStepper = lazy(() => import('./SongEditStepper.tsx'));

const SongEdit = () => {
  return (
    <SongEditContextProvider newSong={true}>
      <BasicHelmet title='Dodawanie piosenki'/>
      <SongEditStepper />
    </SongEditContextProvider>
  );
};

export default SongEdit;

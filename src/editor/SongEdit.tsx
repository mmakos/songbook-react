import { SongEditContextProvider } from './SongEditContext.tsx';
import SongEditStepper from './SongEditStepper.tsx';
import BasicHelmet from '../subsites/BasicHelmet.tsx';

const SongEdit = () => {
  return (
    <SongEditContextProvider newSong={false}>
      <BasicHelmet title='Edycja piosenki'/>
      <SongEditStepper />
    </SongEditContextProvider>
  );
};

export default SongEdit;

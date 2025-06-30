import { IBand } from '../types/song.types.ts';
import SongBandEditor from '../editor/band/SongBandEditor.tsx';
import VerifyEntity from './VerifyEntity.tsx';
import BasicHelmet from '../subsites/BasicHelmet.tsx';

const VerifyBand = () => {
  return (
    <>
      <BasicHelmet title="Weryfikacja zespołu" />
      <VerifyEntity<IBand>
        entityId="band"
        Editor={({ title, entity, setEntity }) => <SongBandEditor title={title} band={entity} setBand={setEntity} />}
      />
    </>
  );
};

export default VerifyBand;

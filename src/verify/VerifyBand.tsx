import { IBand } from '../types/song.types.ts';
import SongBandEditor from '../editor/band/SongBandEditor.tsx';
import VerifyEntity from './VerifyEntity.tsx';

const VerifyBand = () => {
  return (
    <VerifyEntity<IBand>
      entityId="band"
      Editor={({ title, entity, setEntity }) => <SongBandEditor title={title} band={entity} setBand={setEntity} />}
    />
  );
};

export default VerifyBand;

import { ISource } from '../types/song.types.ts';
import VerifyEntity from './VerifyEntity.tsx';
import SongSourceEditor from '../editor/source/SongSourceEditor.tsx';
import BasicHelmet from '../subsites/BasicHelmet.tsx';

const VerifySource = () => {
  return (
    <>
      <BasicHelmet title="Weryfikacja źródła" />
      <VerifyEntity<ISource>
        entityId="source"
        Editor={({ title, entity, setEntity }) => (
          <SongSourceEditor title={title} source={entity} setSource={setEntity} />
        )}
      />
    </>
  );
};

export default VerifySource;

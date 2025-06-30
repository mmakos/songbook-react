import { IPerson } from '../types/song.types.ts';
import VerifyEntity from './VerifyEntity.tsx';
import SongPersonEditor from '../editor/person/SongPersonEditor.tsx';
import BasicHelmet from '../subsites/BasicHelmet.tsx';

const VerifyPerson = () => {
  return (
    <>
      <BasicHelmet title="Weryfikacja osoby" />
      <VerifyEntity<IPerson>
        entityId="person"
        Editor={({ title, entity, setEntity }) => (
          <SongPersonEditor title={title} person={entity} setPerson={setEntity} />
        )}
      />
    </>
  );
};

export default VerifyPerson;

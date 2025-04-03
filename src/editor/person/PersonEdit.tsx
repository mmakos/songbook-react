import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import {IPerson, IPersonData} from '../../types/song.types.ts';
import { fetchAuthor } from '../../author/author.actions.ts';
import SongPersonEditor, { IPersonValidationErrors, validatePerson } from './SongPersonEditor.tsx';
import { personAsString } from '../../author/author.utils.ts';
import { Button, Stack } from '@mui/material';
import {CancelOutlined, SaveOutlined} from '@mui/icons-material';
import RouteButton from '../../components/RouteButton.tsx';
import {personToPersonData} from "./person.mapper.ts";

const PersonEdit = () => {
  const [person, setPerson] = useState<IPersonData>();
  const [personName, setPersonName] = useState<string>();
  const [errors, setErrors] = useState<IPersonValidationErrors>();
  const { personSlug } = useParams();

  const fetchPerson = () => {
    if (!personSlug) return;
    fetchAuthor<IPerson>(`person/${personSlug}/`, (person) => {
      setPerson(personToPersonData(person));
      setPersonName(personAsString(person));
    });
  };

  useEffect(() => {
    fetchPerson();
  }, []);

  const handleSave = () => {
    if (!person) return;
    const errors = validatePerson(person);
    setErrors(errors);
  };

  if (!person || !personName) return;

  return (
    <Stack spacing={2}>
      <SongPersonEditor personName={personName} person={person} setPerson={setPerson} errors={errors} />
      <Stack direction="row" spacing={1}>
        <RouteButton to={`/person/${personSlug}`} variant="outlined" startIcon={<CancelOutlined />} fullWidth>
          Anuluj
        </RouteButton>
        <Button variant="contained" endIcon={<SaveOutlined />} fullWidth onClick={handleSave}>
          Zapisz
        </Button>
      </Stack>
    </Stack>
  );
};

export default PersonEdit;

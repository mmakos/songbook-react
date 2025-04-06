import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { IPerson } from '../../types/song.types.ts';
import { fetchAuthor } from '../../author/author.actions.ts';
import SongPersonEditor, { IPersonValidationErrors, validatePerson } from './SongPersonEditor.tsx';
import { personAsString } from '../../author/author.utils.ts';
import { Button, Stack } from '@mui/material';
import { CancelOutlined, SaveOutlined } from '@mui/icons-material';
import RouteButton from '../../components/RouteButton.tsx';
import { personToPersonData } from './person.mapper.ts';
import useAuthAPI from '../../http/useAuthAPI.ts';
import { useAppDispatch } from '../../store/songbook.store.ts';
import { notifyError, notifySuccess } from '../../store/songbook.reducer.ts';
import WaitingEditsInfo from '../../song/WaitingEditsInfo.tsx';

const PersonEdit = () => {
  const [person, setPerson] = useState<IPerson>();
  const [personName, setPersonName] = useState<string>();
  const [errors, setErrors] = useState<IPersonValidationErrors>();
  const { personSlug, username } = useParams();
  const authAPI = useAuthAPI();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const slugAndUser = `${personSlug}${username ? '/' + username : ''}`;

  const fetchPerson = () => {
    if (!personSlug) return;
    fetchAuthor<IPerson>(`person/${slugAndUser}/`, (person) => {
      setPerson(person);
      setPersonName(personAsString(person));
    });
  };

  useEffect(() => {
    fetchPerson();
  }, [personSlug, username]);

  const handleSave = () => {
    if (!person) return;
    const errors = validatePerson(person);
    setErrors(errors);
    if (!errors) {
      authAPI
        .post(`edit/person/${personSlug}/`, personToPersonData(person))
        .then(() => {
          dispatch(notifySuccess('Pomyślnie zaktualizowano osobę - będzie widoczna w poczekalni do czasu weryfikacji'));
          navigate(`/person/${slugAndUser}`);
        })
        .catch(() => dispatch(notifyError('Niespodziewany błąd podczas aktualizacji osoby')));
    }
  };

  if (!person || !personName) return;

  return (
    <Stack spacing={2}>
      <SongPersonEditor personName={personName} person={person} setPerson={setPerson} errors={errors} />
      <Stack direction="row" spacing={1}>
        <RouteButton to={`/person/${slugAndUser}`} variant="outlined" startIcon={<CancelOutlined />} fullWidth>
          Anuluj
        </RouteButton>
        <Button variant="contained" endIcon={<SaveOutlined />} fullWidth onClick={handleSave}>
          Zapisz
        </Button>
      </Stack>
      <WaitingEditsInfo waiting={person} routeTo={`/edit/person/${personSlug}`} />
    </Stack>
  );
};

export default PersonEdit;

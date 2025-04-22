import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import useAuthAPI from '../http/useAuthAPI.ts';
import { useAppDispatch } from '../store/songbook.store.ts';
import { notifyError, notifySuccess } from '../store/songbook.reducer.ts';
import { IMeetingInfo, TEdit, TSort, TVisibility } from './meeting.types.tsx';

const getVisibilityHelperText = (value: TVisibility) => {
  switch (value) {
    case 'public':
      return 'Wszyscy mogą zobaczyć to spotkanie';
    case 'code':
      return 'Użytkownicy mogą dołączyć jeśli posiadają kod dostępu';
  }
  return `Tylko ty i dodani przez Ciebie użytkownicy`;
};

const getEditHelperText = (value: TEdit) => {
  switch (value) {
    case 'participant':
      return 'Tylko osoby, które dodałeś do śpiewanek';
    case 'user':
      return 'Każdy zalogowany użytkownik, który ma dostęp do śpiewanek';
    case 'everyone':
      return 'Każdy (nawet niezalogowany) użytkownik';
  }
  return 'Tylko ty możesz dodawać piosenki';
};

const getSortHelperText = (value: TSort) => {
  switch (value) {
    case 'title':
      return 'Alfabetyczne po tytule';
    case 'time':
      return 'Po czasie dodania piosenki do śpiewanek';
    case 'single':
      return 'Kolejka piosenek po jednej na użytkownika';
    case 'votes':
      return 'Po liczbie głosów - włącza możliwość głosowania na piosenki dla zalogowanych użytkowników';
  }
  return 'Własna kolejność - możliwość ręcznej zmiany kolejności';
};

const MeetingEditInfo = ({ info }: { info?: IMeetingInfo }) => {
  const [name, setName] = useState(info?.name ?? '');
  const [visibility, setVisibility] = useState<TVisibility>(info?.visibility ?? 'private');
  const [edit, setEdit] = useState<TEdit>(info?.edit ?? 'host');
  const [sort, setSort] = useState<TSort>(info?.sort ?? 'custom');
  const dispatch = useAppDispatch();
  const authAPI = useAuthAPI();

  const handleVisibilityChange = (value: TVisibility) => {
    setVisibility(value);
    if (value !== 'public' && (edit === 'user' || edit === 'everyone')) {
      handleEditChange('host');
    }
  };

  const handleEditChange = (value: TEdit) => {
    setEdit(value);
    if ((value === 'host' || value === 'everyone') && (sort === 'single' || sort === 'votes')) {
      setSort('custom');
    }
  };

  const handleCreate = () => {
    authAPI
      .post('meeting/', { name, visibility, edit, sort })
      .then(() => dispatch(notifySuccess('Pomyślnie utworzono śpiewanki')))
      .catch(() => dispatch(notifyError('Błąd podczas tworzenia śpiewanek')));
  };

  const handleEdit = () => {
    authAPI
        .put(`meeting/${info?.id}/`, { name, visibility, edit, sort })
        .then(() => dispatch(notifySuccess('Pomyślnie zaktualizowano śpiewanki')))
        .catch(() => dispatch(notifyError('Błąd podczas aktualizacji śpiewanek')));
  }

  return (
    <Stack spacing={2} maxWidth="20em">
      <Typography variant="h4">{info ? 'Edytuj śpiewanki' : 'Utwórz śpiewanki'}</Typography>
      <TextField label="Nazwa śpiewanek" value={name} onChange={(e) => setName(e.target.value)} />
      <FormControl>
        <FormLabel>Widoczność śpiewanek</FormLabel>
        <RadioGroup value={visibility} onChange={(e) => handleVisibilityChange(e.target.value as TVisibility)}>
          <FormControlLabel value="private" control={<Radio />} label="Prywatne" />
          <FormControlLabel value="code" control={<Radio />} label="Kod dostępu" />
          <FormControlLabel value="public" control={<Radio />} label="Publiczne" />
        </RadioGroup>
        <FormHelperText>{getVisibilityHelperText(visibility)}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Edycja (dodawanie piosenek)</FormLabel>
        <RadioGroup value={edit} onChange={(e) => handleEditChange(e.target.value as TEdit)}>
          <FormControlLabel value="host" control={<Radio />} label="Tylko ty" />
          <FormControlLabel value="participant" control={<Radio />} label="Każdy uczestnik śpiewanek" />
          <FormControlLabel
            value="user"
            control={<Radio />}
            label="Każdy zalogowany użytkownik"
            disabled={visibility !== 'public'}
          />
          <FormControlLabel value="everyone" control={<Radio />} label="Każdy" disabled={visibility !== 'public'} />
        </RadioGroup>
        <FormHelperText>{getEditHelperText(edit)}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Sortowanie piosenek</FormLabel>
        <RadioGroup value={sort} onChange={(e) => setSort(e.target.value as TSort)}>
          <FormControlLabel value="custom" control={<Radio />} label="Własna kolejność" />
          <FormControlLabel value="title" control={<Radio />} label="Po tytule" />
          <FormControlLabel value="time" control={<Radio />} label="Po czasie dodania" />
          <FormControlLabel
            value="single"
            control={<Radio />}
            label="Kolejka po 1 piosence na użytkownika"
            disabled={edit === 'everyone' || edit === 'host'}
          />
          <FormControlLabel
            value="votes"
            control={<Radio />}
            label="Na podstawie liczby głosów"
            disabled={edit === 'everyone' || edit === 'host'}
          />
        </RadioGroup>
        <FormHelperText>{getSortHelperText(sort)}</FormHelperText>
      </FormControl>
      <Button variant="contained" onClick={info ? handleEdit : handleCreate}>
        {info ? 'Zapisz' : 'Utwórz'}
      </Button>
    </Stack>
  );
};

export default MeetingEditInfo;

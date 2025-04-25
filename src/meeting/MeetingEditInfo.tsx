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
import {notifyError, notifySuccess, setCurrentMeeting} from '../store/songbook.reducer.ts';
import { editText, IMeetingInfo, sortText, TEdit, TSort, TVisibility, visibilityText } from './meeting.types.tsx';
import { useNavigate } from 'react-router';
import {validateString} from "../editor/validation.utils.ts";

const MeetingEditInfo = ({ info }: { info?: IMeetingInfo }) => {
  const [name, setName] = useState(info?.name ?? '');
  const [nameError, setNameError] = useState<string>();
  const [visibility, setVisibility] = useState<TVisibility>(info?.visibility ?? 'private');
  const [edit, setEdit] = useState<TEdit>(info?.edit ?? 'host');
  const [sort, setSort] = useState<TSort>(info?.sort ?? 'time');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authAPI } = useAuthAPI();

  const handleVisibilityChange = (value: TVisibility) => {
    setVisibility(value);
    if (value !== 'public' && (edit === 'user' || edit === 'everyone')) {
      handleEditChange('host');
    }
  };

  const handleEditChange = (value: TEdit) => {
    setEdit(value);
    if ((value === 'host' || value === 'everyone') && (sort === 'single' || sort === 'votes')) {
      setSort('time');
    }
  };

  const validate = () => {
    const nameValidation = validateString(name, 'name', "Nazwa użytkownika", 5, 50, true);
    setNameError(nameValidation.name);
    return !nameValidation.name;
  }

  const handleCreate = () => {
    if (!validate()) return;
    authAPI
      .post('meeting/', { name, visibility, edit, sort })
      .then(({ data }) => {
        dispatch(notifySuccess('Pomyślnie utworzono śpiewanki'));
        dispatch(setCurrentMeeting(data.id))
        navigate(`/meeting/${data.id}`);
      })
      .catch(() => dispatch(notifyError('Błąd podczas tworzenia śpiewanek')));
  };

  const handleEdit = () => {
    if (!validate()) return;
    authAPI
      .put(`meeting/${info?.id}/`, { name, visibility, edit, sort })
      .then(({ data }) => {
        dispatch(notifySuccess('Pomyślnie zaktualizowano śpiewanki'));
        navigate(`/meeting/${data.id}`);
      })
      .catch(() => dispatch(notifyError('Błąd podczas aktualizacji śpiewanek')));
  };

  return (
    <Stack spacing={2} maxWidth="30em">
      <Typography variant="h4">{info ? 'Edytuj śpiewanki' : 'Utwórz śpiewanki'}</Typography>
      <TextField
        label="Nazwa śpiewanek"
        value={name}
        error={!!nameError}
        helperText={nameError}
        onChange={(e) => setName(e.target.value)}
      />
      <FormControl>
        <FormLabel>Widoczność śpiewanek</FormLabel>
        <RadioGroup value={visibility} onChange={(e) => handleVisibilityChange(e.target.value as TVisibility)}>
          <FormControlLabel value="private" control={<Radio />} label={visibilityText['private'].text} />
          <FormControlLabel value="code" control={<Radio />} label={visibilityText['code'].text} />
          <FormControlLabel value="public" control={<Radio />} label={visibilityText['public'].text} />
        </RadioGroup>
        <FormHelperText>{visibilityText[visibility].helper}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Edycja (dodawanie piosenek)</FormLabel>
        <RadioGroup value={edit} onChange={(e) => handleEditChange(e.target.value as TEdit)}>
          <FormControlLabel value="host" control={<Radio />} label={editText['host'].text} />
          <FormControlLabel value="participant" control={<Radio />} label={editText['participant'].text} />
          <FormControlLabel
            value="user"
            control={<Radio />}
            label={editText['user'].text}
            disabled={visibility !== 'public'}
          />
          <FormControlLabel
            value="everyone"
            control={<Radio />}
            label={editText['everyone'].text}
            disabled={visibility !== 'public'}
          />
        </RadioGroup>
        <FormHelperText>{editText[edit].helper}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Sortowanie piosenek</FormLabel>
        <RadioGroup value={sort} onChange={(e) => setSort(e.target.value as TSort)}>
          <FormControlLabel value="title" control={<Radio />} label={sortText['title'].helper} />
          <FormControlLabel value="time" control={<Radio />} label={sortText['time'].helper} />
          <FormControlLabel
            value="single"
            control={<Radio />}
            label={sortText['single'].helper}
            disabled={edit === 'everyone' || edit === 'host'}
          />
          <FormControlLabel
            value="votes"
            control={<Radio />}
            label={sortText['votes'].helper}
            disabled={edit === 'everyone' || edit === 'host'}
          />
          <FormControlLabel value="custom" control={<Radio />} label={sortText['custom'].helper} disabled />
        </RadioGroup>
        <FormHelperText>{sortText[sort].helper}</FormHelperText>
      </FormControl>
      <Button variant="contained" onClick={info ? handleEdit : handleCreate}>
        {info ? 'Zapisz' : 'Utwórz'}
      </Button>
    </Stack>
  );
};

export default MeetingEditInfo;

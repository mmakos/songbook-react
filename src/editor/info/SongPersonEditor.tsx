import { FC } from 'react';
import { Checkbox, FormControlLabel, FormGroup, IconButton, TextField, Typography } from '@mui/material';
import { IPerson } from '../../types/song.types.ts';
import { personAsString } from '../../author/author.utils.ts';
import { Delete } from '@mui/icons-material';

interface ISongPersonEditorProps {
  personName: string;
  person: IPerson;
  setPerson: (person: IPerson) => void;
  deletePerson: () => void;
}

const SongPersonEditor: FC<ISongPersonEditorProps> = ({ personName, person, setPerson, deletePerson }) => {
  const setName = (name: string) => setPerson({ ...person, name });
  const setLastName = (lastName: string) => setPerson({ ...person, lastName });
  const setSecondName = (secondName: string) => setPerson({ ...person, secondName });
  const setNickname = (nickname: string) => setPerson({ ...person, nickname });
  const setUrl = (url: string) => setPerson({ ...person, url });
  const setForceNickname = (forceNickname: boolean) => setPerson({ ...person, forceNickname });
  const setForceSecondName = (forceSecondName: boolean) => setPerson({ ...person, forceSecondName });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <div style={{ display: 'flex' }}>
        <Typography variant="h6">Edytuj osobę „{personName}”</Typography>
        <IconButton onClick={deletePerson} sx={{ ml: 'auto' }}>
          <Delete />
        </IconButton>
      </div>
      <TextField disabled label="Podgląd" value={personAsString(person)} />
      <TextField required label="Imię" value={person.name} onChange={(event) => setName(event.target.value)} />
      <TextField
        required
        label="Nazwisko"
        value={person.lastName}
        onChange={(event) => setLastName(event.target.value)}
      />
      <FormGroup>
        <TextField
          label="Drugie imię/imiona"
          value={person.secondName ?? ''}
          onChange={(event) => setSecondName(event.target.value)}
        />
        <FormControlLabel
          control={<Checkbox checked={person.forceSecondName} onChange={(e) => setForceSecondName(e.target.checked)} />}
          label="Zawsze pokazuj drugie imię"
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="Pseudonim artystyczny"
          value={person.nickname ?? ''}
          onChange={(event) => setNickname(event.target.value)}
        />
        <FormControlLabel
          control={<Checkbox checked={person.forceNickname} onChange={(e) => setForceNickname(e.target.checked)} />}
          label="Pokazuj sam pseudonim"
        />
      </FormGroup>

      <TextField
        type="url"
        label="Link (najlepiej wikipedia)"
        value={person.url}
        onChange={(event) => setUrl(event.target.value)}
        slotProps={{
          htmlInput: {
            maxLength: 200,
          },
        }}
      />
    </div>
  );
};

export default SongPersonEditor;

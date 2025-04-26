import { Checkbox, FormControlLabel, FormGroup, IconButton, Stack, TextField, Typography } from '@mui/material';
import { IPersonData } from '../../types/song.types.ts';
import { personAsString } from '../../author/author.utils.ts';
import { Delete } from '@mui/icons-material';
import { undefinedIfBlank, validateHttpURL, validateString } from '../validation.utils.ts';

export interface IPersonValidationErrors {
  name?: string;
  secondName?: string;
  lastName?: string;
  nickname?: string;
  url?: string;
}

export const validatePerson = (person: IPersonData): IPersonValidationErrors | undefined => {
  const errors: IPersonValidationErrors = {
    ...validateString(person.name, 'name', 'Imię', 3, 30, true),
    ...validateString(person.secondName, 'secondName', 'Drugie imię', 3, 50),
    ...validateString(person.lastName, 'lastName', 'Nazwisko', 3, 50, true),
    ...validateString(person.nickname, 'nickname', 'Pseudonim', 3, 100),
    ...validateHttpURL(person.url),
  };

  return Object.keys(errors).length ? errors : undefined;
};

interface ISongPersonEditorProps<Person extends IPersonData> {
  title: string;
  person: Person;
  setPerson: (person: Person) => void;
  deletePerson?: () => void;
  errors?: IPersonValidationErrors;
}

const SongPersonEditor = <Person extends IPersonData>({
  title,
  person,
  setPerson,
  deletePerson,
  errors,
}: ISongPersonEditorProps<Person>) => {
  const setName = (name: string) => setPerson({ ...person, name });
  const setLastName = (lastName: string) => setPerson({ ...person, lastName });
  const setSecondName = (secondName: string) => setPerson({ ...person, secondName: undefinedIfBlank(secondName) });
  const setNickname = (nickname: string) => setPerson({ ...person, nickname: undefinedIfBlank(nickname) });
  const setUrl = (url: string) => setPerson({ ...person, url: undefinedIfBlank(url) });
  const setForceNickname = (forceNickname: boolean) => setPerson({ ...person, forceNickname });
  const setForceSecondName = (forceSecondName: boolean) => setPerson({ ...person, forceSecondName });

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{title}</Typography>
        {deletePerson && (
          <IconButton onClick={deletePerson}>
            <Delete />
          </IconButton>
        )}
      </Stack>
      <TextField disabled label="Podgląd" value={personAsString(person)} />
      <TextField
        required
        label="Imię"
        error={!!errors?.name}
        helperText={errors?.name}
        value={person.name}
        onChange={(event) => setName(event.target.value)}
      />
      <TextField
        required
        label="Nazwisko"
        error={!!errors?.lastName}
        helperText={errors?.lastName}
        value={person.lastName}
        onChange={(event) => setLastName(event.target.value)}
      />
      <FormGroup>
        <TextField
          label="Drugie imię/imiona"
          error={!!errors?.secondName}
          helperText={errors?.secondName}
          value={person.secondName ?? ''}
          onChange={(event) => setSecondName(event.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              disabled={!person.secondName}
              checked={person.forceSecondName}
              onChange={(e) => setForceSecondName(e.target.checked)}
            />
          }
          label="Zawsze pokazuj drugie imię"
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="Pseudonim artystyczny"
          error={!!errors?.nickname}
          helperText={errors?.nickname}
          value={person.nickname ?? ''}
          onChange={(event) => setNickname(event.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              disabled={!person.nickname}
              checked={person.forceNickname}
              onChange={(e) => setForceNickname(e.target.checked)}
            />
          }
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
    </Stack>
  );
};

export default SongPersonEditor;

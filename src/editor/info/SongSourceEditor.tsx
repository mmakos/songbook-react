import { FC } from 'react';
import {FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography} from '@mui/material';
import { ISource, SourceType } from '../../types/song.types.ts';
import { sourceTypeNominative } from '../../author/author.utils.ts';
import { isValidHttpURL } from '../validation.utils.ts';
import {Delete} from "@mui/icons-material";

const currentYear = new Date().getFullYear();

export interface ISourceValidationErrors {
  name?: string;
  url?: string;
}

export const validateSource = (source: ISource): ISourceValidationErrors | undefined => {
  const nameLength = source.name.trim().length;
  const errors: ISourceValidationErrors = {};
  if (nameLength < 3) errors.name = 'Nazwa zespołu musi mieć przynajmniej 3 znaki';
  else if (nameLength > 50) errors.name = 'Nazwa zespołu może mieć maksymalnie 50 znaków';

  if (source.url && !isValidHttpURL(source.url)) errors.url = 'Nieprawidłowy adres URL';

  return Object.keys(errors).length ? errors : undefined;
};

interface ISongSourceEditorProps {
  sourceName: string;
  source: ISource;
  setSource: (source: ISource) => void;
  deleteSource: () => void;
  errors?: ISourceValidationErrors;
}

const SongSourceEditor: FC<ISongSourceEditorProps> = ({ sourceName, source, setSource, deleteSource, errors }) => {
  const setName = (name: string) => setSource({ ...source, name });
  const setType = (type: string) => setSource({ ...source, type: type as SourceType });
  const setUrl = (url: string) => setSource({ ...source, url });
  const setYear = (year: string) => {
    if (!year.length) {
      setSource({ ...source, year: undefined });
      return;
    }
    const yearNum = +year;
    !isNaN(yearNum) && setSource({ ...source, year: yearNum });
  };

  return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
        <div style={{display: 'flex'}}>
          <Typography variant="h6">Edytuj źródło „{sourceName}”</Typography>
          <IconButton onClick={deleteSource} sx={{ml: 'auto'}}>
            <Delete/>
          </IconButton>
        </div>
        <TextField
            label="Nazwa źródła"
            required
            error={!!errors?.name}
            helperText={errors?.name}
            value={source.name}
            onChange={(event) => setName(event.target.value)}
        />
        <FormControl>
          <InputLabel>Typ źródła</InputLabel>
          <Select
              variant="outlined"
              label="Typ źródła"
              value={source.type}
              onChange={(event) => setType(event.target.value as SourceType)}
          >
            {Object.values(SourceType).map((t) => (
                <MenuItem key={t} value={t}>
                  {sourceTypeNominative(t)}
                </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
            type="number"
            label="Rok powstania"
            value={source.year ?? ''}
            onChange={(event) => setYear(event.target.value)}
            slotProps={{
              htmlInput: {
                min: 1700,
                max: currentYear,
                step: 1,
              },
            }}
        />
        <TextField
            type="url"
            label="Link (najlepiej wikipedia)"
            error={!!errors?.url}
            helperText={errors?.url}
            value={source.url}
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

export default SongSourceEditor;

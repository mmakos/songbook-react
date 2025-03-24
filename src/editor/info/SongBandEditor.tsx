import { FC } from 'react';
import { IconButton, TextField, Typography } from '@mui/material';
import { IBand } from '../../types/song.types.ts';
import { isValidHttpURL } from '../validation.utils.ts';
import { Delete } from '@mui/icons-material';

export interface IBandValidationErrors {
  name?: string;
  url?: string;
}

export const validateBand = (band: IBand): IBandValidationErrors | undefined => {
  const nameLength = band.name.trim().length;
  const errors: IBandValidationErrors = {};
  if (nameLength < 3) errors.name = 'Nazwa zespołu musi mieć przynajmniej 3 znaki';
  else if (nameLength > 50) errors.name = 'Nazwa zespołu może mieć maksymalnie 50 znaków';

  if (band.url && !isValidHttpURL(band.url)) errors.url = 'Nieprawidłowy adres URL';

  return Object.keys(errors).length ? errors : undefined;
};

interface ISongBandEditorProps {
  bandName: string;
  band: IBand;
  setBand: (band: IBand) => void;
  deleteBand: () => void;
  errors?: IBandValidationErrors;
}

const SongBandEditor: FC<ISongBandEditorProps> = ({ bandName, band, setBand, deleteBand, errors }) => {
  const setName = (name: string) => setBand({ ...band, name });
  const setUrl = (url: string) => setBand({ ...band, url });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <div style={{ display: 'flex' }}>
        <Typography variant="h6">Edytuj zespół „{bandName}”</Typography>
        <IconButton onClick={deleteBand} sx={{ml: 'auto'}}>
          <Delete />
        </IconButton>
      </div>
      <TextField
        label="Nazwa zespołu"
        required
        error={!!errors?.name}
        helperText={errors?.name}
        value={band.name}
        onChange={(event) => setName(event.target.value)}
      />

      <TextField
        type="url"
        label="Link (najlepiej wikipedia)"
        error={!!errors?.url}
        helperText={errors?.url}
        value={band.url}
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

export default SongBandEditor;

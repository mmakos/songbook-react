import { FC } from 'react';
import { IconButton, Stack, TextField, Typography } from '@mui/material';
import { IBand } from '../../types/song.types.ts';
import { validateHttpURL, validateString } from '../validation.utils.ts';
import { Delete } from '@mui/icons-material';

export interface IBandValidationErrors {
  name?: string;
  url?: string;
}

export const validateBand = (band: IBand): IBandValidationErrors | undefined => {
  const errors: IBandValidationErrors = {
    ...validateString(band.name, 'name', 'Nazwa zespołu', 3, 50, true),
    ...validateHttpURL(band.url),
  };

  return Object.keys(errors).length ? errors : undefined;
};

interface ISongBandEditorProps {
  bandName: string;
  band: IBand;
  setBand: (band: IBand) => void;
  deleteBand?: () => void;
  errors?: IBandValidationErrors;
}

const SongBandEditor: FC<ISongBandEditorProps> = ({ bandName, band, setBand, deleteBand, errors }) => {
  const setName = (name: string) => setBand({ ...band, name });
  const setUrl = (url: string) => setBand({ ...band, url });

  return (
    <Stack gap={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Edytuj zespół „{bandName}”</Typography>
        {deleteBand && (
          <IconButton onClick={deleteBand}>
            <Delete />
          </IconButton>
        )}
      </Stack>
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
    </Stack>
  );
};

export default SongBandEditor;

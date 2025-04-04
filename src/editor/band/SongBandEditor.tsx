import { IconButton, Stack, TextField, Typography } from '@mui/material';
import { IBandData } from '../../types/song.types.ts';
import { validateHttpURL, validateString } from '../validation.utils.ts';
import { Delete } from '@mui/icons-material';

export interface IBandValidationErrors {
  name?: string;
  url?: string;
}

export const validateBand = (band: IBandData): IBandValidationErrors | undefined => {
  const errors: IBandValidationErrors = {
    ...validateString(band.name, 'name', 'Nazwa zespołu', 3, 50, true),
    ...validateHttpURL(band.url),
  };

  return Object.keys(errors).length ? errors : undefined;
};

interface ISongBandEditorProps<Band extends IBandData> {
  bandName: string;
  band: Band;
  setBand: (band: Band) => void;
  deleteBand?: () => void;
  errors?: IBandValidationErrors;
}

const SongBandEditor = <Band extends IBandData>({
  bandName,
  band,
  setBand,
  deleteBand,
  errors,
}: ISongBandEditorProps<Band>) => {
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

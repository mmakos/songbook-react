import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { IBand } from '../../types/song.types.ts';
import { fetchAuthor } from '../../author/author.actions.ts';
import SongBandEditor, { IBandValidationErrors, validateBand } from './SongBandEditor.tsx';
import { Button, Stack } from '@mui/material';
import { CancelOutlined, SaveOutlined } from '@mui/icons-material';
import Progress from '../../components/Progress.tsx';
import RouteButton from '../../components/RouteButton.tsx';

const BandEdit = () => {
  const [band, setBand] = useState<IBand>();
  const [bandName, setBandName] = useState<string>();
  const [errors, setErrors] = useState<IBandValidationErrors>();
  const { bandSlug } = useParams();

  const fetchBand = () => {
    if (!bandSlug) return;
    fetchAuthor<IBand>(`band/${bandSlug}/`, (band) => {
      setBand(band);
      setBandName(band.name);
    });
  };

  useEffect(() => {
    fetchBand();
  }, []);

  const handleSave = () => {
    if (!band) return;
    const errors = validateBand(band);
    setErrors(errors);
  };

  if (!band || !bandName) return <Progress />;

  return (
    <Stack gap={2}>
      <SongBandEditor bandName={bandName} band={band} setBand={setBand} errors={errors} />
      <Stack direction="row" spacing={1}>
        <RouteButton to={`/band/${bandSlug}`} variant="outlined" startIcon={<CancelOutlined />} fullWidth>
          Anuluj
        </RouteButton>
        <Button variant="contained" endIcon={<SaveOutlined />} fullWidth onClick={handleSave}>
          Zapisz
        </Button>
      </Stack>
    </Stack>
  );
};

export default BandEdit;

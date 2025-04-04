import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { IBand } from '../../types/song.types.ts';
import { fetchAuthor } from '../../author/author.actions.ts';
import SongBandEditor, { IBandValidationErrors, validateBand } from './SongBandEditor.tsx';
import { Button, Stack } from '@mui/material';
import { CancelOutlined, SaveOutlined } from '@mui/icons-material';
import Progress from '../../components/Progress.tsx';
import RouteButton from '../../components/RouteButton.tsx';
import { bandToBandData } from './band.mapper.ts';
import useAuthAPI from '../../http/useAuthAPI.ts';
import { useAppDispatch } from '../../store/songbook.store.ts';
import { notifyError, notifySuccess } from '../../store/songbook.reducer.ts';
import WaitingEditsInfo from '../../song/WaitingEditsInfo.tsx';

const BandEdit = () => {
  const [band, setBand] = useState<IBand>();
  const [bandName, setBandName] = useState<string>();
  const [errors, setErrors] = useState<IBandValidationErrors>();
  const { bandSlug, username } = useParams();
  const authAPI = useAuthAPI();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const slugAndUser = `${bandSlug}${username ? '/' + username : ''}`;

  const fetchBand = () => {
    if (!bandSlug) return;
    fetchAuthor<IBand>(`band/${slugAndUser}/`, (band) => {
      setBand(band);
      setBandName(band.name);
    });
  };

  useEffect(() => {
    fetchBand();
  }, [bandSlug, username]);

  const handleSave = () => {
    if (!band) return;
    const errors = validateBand(band);
    setErrors(errors);
    if (!errors) {
      authAPI
        .post(`edit/band/${bandSlug}/`, bandToBandData(band))
        .then(() => {
          dispatch(notifySuccess('Pomyślnie zaktualizowano zespół'));
          navigate(`/band/${slugAndUser}`);
        })
        .catch(() => dispatch(notifyError('Niespodziewany błąd podczas aktualizacji zespołu')));
    }
  };

  if (!band || !bandName) return <Progress />;

  return (
    <Stack gap={2}>
      <SongBandEditor bandName={bandName} band={band} setBand={setBand} errors={errors} />
      <Stack direction="row" spacing={1}>
        <RouteButton to={`/band/${slugAndUser}`} variant="outlined" startIcon={<CancelOutlined />} fullWidth>
          Anuluj
        </RouteButton>
        <Button variant="contained" endIcon={<SaveOutlined />} fullWidth onClick={handleSave}>
          Zapisz
        </Button>
      </Stack>
      <WaitingEditsInfo waiting={band} routeTo={`/edit/band/${bandSlug}`} />
    </Stack>
  );
};

export default BandEdit;

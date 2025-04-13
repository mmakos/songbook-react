import { useNavigate, useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { IEditResult, ISource } from '../../types/song.types.ts';
import { fetchAuthor } from '../../author/author.actions.ts';
import SongSourceEditor, { ISourceValidationErrors, validateSource } from './SongSourceEditor.tsx';
import { Button, Stack } from '@mui/material';
import { CancelOutlined, SaveOutlined } from '@mui/icons-material';
import RouteButton from '../../components/RouteButton.tsx';
import { sourceToSourceData } from './source.mapper.ts';
import useAuthAPI from '../../http/useAuthAPI.ts';
import { useAppDispatch } from '../../store/songbook.store.ts';
import { notifyError, notifySuccess } from '../../store/songbook.reducer.ts';
import WaitingEditsInfo from '../../song/WaitingEditsInfo.tsx';
import { validateChanged } from '../validation.utils.ts';
import { AxiosResponse } from 'axios';

const SourceEdit = () => {
  const originalSource = useRef<ISource>();
  const [source, setSource] = useState<ISource>();
  const [sourceName, setSourceName] = useState<string>();
  const [errors, setErrors] = useState<ISourceValidationErrors>();
  const { sourceSlug, username } = useParams();
  const authAPI = useAuthAPI();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const slugAndUser = `${sourceSlug}${username ? '/' + username : ''}`;

  const fetchSource = () => {
    if (!sourceSlug) return;
    fetchAuthor<ISource>(`source/${slugAndUser}/`, (source) => {
      setSource(source);
      originalSource.current = source;
      setSourceName(source.name);
    });
  };

  useEffect(() => {
    fetchSource();
  }, [sourceSlug, username]);

  const handleSave = () => {
    if (!source || !originalSource.current) return;
    const errors = validateSource(source);
    setErrors(errors);
    if (!errors) {
      const sourceData = sourceToSourceData(source);
      if (!validateChanged(sourceData, originalSource.current)) {
        dispatch(notifyError('Nie wprowadzono żadnych zmian'));
        return;
      }
      authAPI
        .post(`edit/source/${sourceSlug}/`, sourceToSourceData(source))
        .then(({ data }: AxiosResponse<IEditResult>) => {
          dispatch(
            notifySuccess('Pomyślnie zaktualizowano źródło - będzie widoczne w poczekalni do czasu weryfikacji')
          );
          navigate(`/source/${data.slug}/${data.editor}`);
        })
        .catch(() => dispatch(notifyError('Niespodziewany błąd podczas aktualizacji źródła')));
    }
  };

  if (!source || !sourceName) return;

  return (
    <Stack spacing={2}>
      <SongSourceEditor title={`Edytuj źródło „${sourceName}”`} source={source} setSource={setSource} errors={errors} />
      <Stack direction="row" spacing={1}>
        <RouteButton to={`/source/${slugAndUser}`} variant="outlined" startIcon={<CancelOutlined />} fullWidth>
          Anuluj
        </RouteButton>
        <Button variant="contained" endIcon={<SaveOutlined />} fullWidth onClick={handleSave}>
          Zapisz
        </Button>
      </Stack>
      <WaitingEditsInfo waiting={source} routeTo={`/edit/source/${sourceSlug}`} />
    </Stack>
  );
};

export default SourceEdit;

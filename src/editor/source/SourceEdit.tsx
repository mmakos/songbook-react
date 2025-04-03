import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { ISource, ISourceData } from '../../types/song.types.ts';
import { fetchAuthor } from '../../author/author.actions.ts';
import SongSourceEditor, { ISourceValidationErrors, validateSource } from './SongSourceEditor.tsx';
import { Button, Stack } from '@mui/material';
import { CancelOutlined, SaveOutlined } from '@mui/icons-material';
import RouteButton from '../../components/RouteButton.tsx';
import {sourceToSourceData} from "./source.mapper.ts";

const SourceEdit = () => {
  const [source, setSource] = useState<ISourceData>();
  const [sourceName, setSourceName] = useState<string>();
  const [errors, setErrors] = useState<ISourceValidationErrors>();
  const { sourceSlug } = useParams();

  const fetchSource = () => {
    if (!sourceSlug) return;
    fetchAuthor<ISource>(`source/${sourceSlug}/`, (source) => {
      setSource(sourceToSourceData(source));
      setSourceName(source.name);
    });
  };

  useEffect(() => {
    fetchSource();
  }, []);

  const handleSave = () => {
    if (!source) return;
    const errors = validateSource(source);
    setErrors(errors);
  };

  if (!source || !sourceName) return;

  return (
    <Stack spacing={2}>
      <SongSourceEditor sourceName={sourceName} source={source} setSource={setSource} errors={errors} />
      <Stack direction="row" spacing={1}>
        <RouteButton to={`/source/${sourceSlug}`} variant="outlined" startIcon={<CancelOutlined />} fullWidth>
          Anuluj
        </RouteButton>
        <Button variant="contained" endIcon={<SaveOutlined />} fullWidth onClick={handleSave}>
          Zapisz
        </Button>
      </Stack>
    </Stack>
  );
};

export default SourceEdit;

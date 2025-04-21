import { Button, Stack, TextField } from '@mui/material';
import { CloudDownload, SkipNext } from '@mui/icons-material';
import { IAuthorsCache, useSongEditContext } from '../SongEditContext.tsx';
import { api } from '../../http/api.ts';
import { useState } from 'react';
import { validateHttpURL } from '../validation.utils.ts';
import { AxiosResponse } from 'axios';
import { ISongEdit } from '../../types/song.types.ts';
import { useAppDispatch } from '../../store/songbook.store.ts';
import { notifyError } from '../../store/songbook.reducer.ts';

const ImportSong = () => {
  const { updateStep, setSongEdit, authorsCache } = useSongEditContext();
  const [href, setHref] = useState('');
  const [hrefError, setHrefError] = useState<string>();
  const dispatch = useAppDispatch();

  const handleSkip = () => {
    updateStep(1);
  };

  const handleImport = () => {
    const hrefValid = !href.length
      ? { url: 'Podaj adres URL piosenki do zaimportowania lub kliknij "Pomiń"' }
      : validateHttpURL(href);
    if (hrefValid.url) {
      setHrefError(hrefValid.url);
    } else {
      setHrefError(undefined);
      api
        .get('import/song/', { params: { href: href } })
        .then((response: AxiosResponse<ISongEdit & { cache: IAuthorsCache }>) => {
          setSongEdit(response.data);
          authorsCache.person = { ...authorsCache.person, ...response.data.cache.person };
          authorsCache.band = response.data.cache.band ?? authorsCache.band;
          updateStep(1);
        })
        .catch(() => {
          dispatch(notifyError('Nie udało się zaimportować piosenki. Spróbuj inny link.'));
          setHref('');
        });
    }
  };

  return (
    <Stack spacing={1}>
      <TextField
        label="Link do piosenki"
        error={!!hrefError}
        helperText={hrefError}
        value={href}
        onChange={(e) => setHref(e.target.value)}
      />
      <Stack direction="row" spacing={1} justifyContent="right">
        <Button variant="outlined" startIcon={<SkipNext />} onClick={handleSkip}>
          Pomiń
        </Button>
        <Button variant="contained" endIcon={<CloudDownload />} onClick={handleImport}>
          Importuj
        </Button>
      </Stack>
    </Stack>
  );
};

export default ImportSong;

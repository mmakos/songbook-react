import { songToSongEdit, useSongEditContext } from '../SongEditContext.tsx';
import Song from '../../song/Song.tsx';
import { Button, Stack } from '@mui/material';
import { BackspaceOutlined, SaveOutlined, VerticalSplitOutlined } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import SongCompare from './SongCompare.tsx';
import { IAuthorEdit, ISlug, ISong, ISongEdit } from '../../types/song.types.ts';
import useAuthAPI from '../../http/useAuthAPI.ts';
import { useAppDispatch } from '../../store/songbook.store.ts';
import { notifyError, notifySuccess } from '../../store/songbook.reducer.ts';
import { useNavigate } from 'react-router';

const mergeList = <T, U extends ISlug>(songEdit?: IAuthorEdit<T>, song?: U[]): U[] | undefined => {
  const list: U[] = [];
  console.log(songEdit, song);
  if (songEdit?.existing) {
    for (const e of songEdit.existing) {
      const el = song?.find((l) => l.slug === e);
      if (el) list.push(el);
      else list.push({ slug: e, name: e, lastName: '' } as unknown as U);
    }
  }
  if (songEdit?.new) {
    list.push(...songEdit.new.map((el) => ({ ...el, slug: '' }) as unknown as U));
  }
  return list.length ? list : undefined;
};

const SongEditSummary = () => {
  const { updateStep, song, songEdit, textEdit } = useSongEditContext();
  const [compare, setCompare] = useState(false);
  const authAPI = useAuthAPI();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const songPreview: ISong = useMemo(() => {
    return {
      slug: song.slug,
      created: song.created,
      ...songEdit,
      verses: textEdit ? songEdit.verses : song.verses,
      lyrics: mergeList(songEdit.lyrics, song.lyrics),
      composer: mergeList(songEdit.composer, song.composer),
      translation: mergeList(songEdit.translation, song.translation),
      performer: mergeList(songEdit.performer, song.performer),
      source: mergeList(songEdit.source, song.source),
      band: (songEdit.band?.new ?? songEdit.band?.existing) ? song.band : undefined,
    };
  }, [song]);

  const save = () => {
    const songEditFinal: Partial<ISongEdit> = { ...songEdit };
    if (!textEdit) {
      delete songEditFinal.verses;
    }
    authAPI
      .post(`/edit/song/${song.slug}/`, songEditFinal)
      .then(() => {
        dispatch(
          notifySuccess('Pomyślnie zaktualizowano piosenkę - będzie widoczna w poczekalni do czasu weryfikacji')
        );
        navigate(`/song/${song.slug}`);
      })
      .catch(() => dispatch(notifyError('Niespodziewany błąd podczas aktualizacji piosenki')));
  };

  return (
    <>
      <Stack direction="row" gap={1} justifyContent="center">
        <Button variant="outlined" size="large" onClick={() => updateStep(-1)} startIcon={<BackspaceOutlined />}>
          Wróć
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => setCompare(!compare)}
          endIcon={<VerticalSplitOutlined />}
        >
          {compare ? 'Podgląd' : 'Porównaj'}
        </Button>
        <Button variant="contained" size="large" onClick={save} endIcon={<SaveOutlined />}>
          Zapisz
        </Button>
      </Stack>
      {compare ? (
        <SongCompare
          oldSong={songToSongEdit(song)}
          newSong={textEdit ? songEdit : { ...songEdit, verses: song.verses }}
        />
      ) : (
        <Stack direction="row" justifyContent="center">
          <Song song={songPreview} />
        </Stack>
      )}
    </>
  );
};

export default SongEditSummary;

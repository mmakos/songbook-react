import { songToSongEdit, useSongEditContext } from '../SongEditContext.tsx';
import Song from '../../song/Song.tsx';
import { Button, Stack, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import {
  BackspaceOutlined,
  DataObject,
  Preview,
  Reorder,
  SaveOutlined,
  ThumbDown,
  ThumbUp,
  VerticalSplitOutlined,
} from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { IAuthorEdit, IEditResult, ISlug, ISong, ISongEdit } from '../../types/song.types.ts';
import useAuthAPI from '../../http/useAuthAPI.ts';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';
import { notifyError, notifySuccess } from '../../store/songbook.reducer.ts';
import { useNavigate, useParams } from 'react-router';
import { AxiosResponse } from 'axios';
import DiffViewer from 'react-diff-viewer-continued';

const mergeList = <T, U extends ISlug>(
  cache: Record<string, U>,
  songEdit?: IAuthorEdit<T>,
  song?: U[]
): U[] | undefined => {
  const list: U[] = [];
  if (songEdit?.existing) {
    for (const e of songEdit.existing) {
      let el: U | undefined = cache[e];
      if (!el) el = song?.find((s) => s.slug === e);
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
  const { updateStep, song, songEdit, authorsCache, textEdit, keyEdit, newSong, setCanExit, verification } =
    useSongEditContext();
  const [compare, setCompare] = useState(false);
  const [split, setSplit] = useState(true);
  const authAPI = useAuthAPI();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { username } = useParams();
  const user = useAppSelector((state) => state.user);

  const songPreview: ISong = useMemo(() => {
    return {
      slug: song ? song.slug : songEdit.title,
      created: song ? song.created : { time: Date.now() / 1000, name: user?.username, type: user?.type },
      ...songEdit,
      key: keyEdit || !song ? songEdit.key : song.key,
      verses: textEdit || !song ? songEdit.verses : song.verses,
      lyrics: mergeList(authorsCache.person, songEdit.lyrics, song?.lyrics),
      composer: mergeList(authorsCache.person, songEdit.composer, song?.composer),
      translation: mergeList(authorsCache.person, songEdit.translation, song?.translation),
      performer: mergeList(authorsCache.person, songEdit.performer, song?.performer),
      source: mergeList(authorsCache.source, songEdit.source, song?.source),
      band: (songEdit.band?.new ?? songEdit.band?.existing) ? (song?.band ?? authorsCache.band) : undefined,
    };
  }, [song]);

  const [jsonOld, jsonNew, equals] = useMemo(() => {
    const old = JSON.stringify(song ? songToSongEdit(song) : undefined, undefined, 2);
    const edited = JSON.stringify(textEdit ? songEdit : { ...songEdit, verses: song?.verses ?? [] }, undefined, 2);
    return [old, edited, old === edited];
  }, [song, textEdit, songEdit]);

  const stripSong = () => {
    const songEditFinal: Partial<ISongEdit> = { ...songEdit };
    if (!textEdit) {
      delete songEditFinal.verses;
    }
    if (!keyEdit) {
      delete songEditFinal.key;
    }
    return songEditFinal;
  };

  const save = () => {
    const songEditFinal = stripSong();
    setCanExit(true);
    authAPI
      .post(newSong ? 'add/song/' : `edit/song/${song!.slug}/`, songEditFinal)
      .then(({ data }: AxiosResponse<IEditResult>) => {
        dispatch(
          notifySuccess('Pomyślnie zaktualizowano piosenkę - będzie widoczna w poczekalni do czasu weryfikacji')
        );
        navigate(`/song/${data.slug}${newSong ? "" : "/" + data.editor}`);
      })
      .catch(() => {
        dispatch(notifyError('Niespodziewany błąd podczas aktualizacji piosenki'));
        setCanExit(false);
      });
  };

  const verify = () => {
    const songEditFinal = stripSong();
    setCanExit(true);
    authAPI
      .post(`verify/song/${song!.slug}/${username}/`, songEditFinal)
      .then(({ data }: AxiosResponse<IEditResult>) => {
        dispatch(notifySuccess('Pomyślnie zweryfikowano piosenkę'));
        navigate(`/song/${data.slug}`);
      })
      .catch(() => {
        dispatch(notifyError('Niespodziewany błąd podczas weryfikacji piosenki'));
        setCanExit(false);
      });
  };

  const rejectEdit = () => {
    setCanExit(true);
    authAPI
      .delete(`verify/song/${song!.slug}/${username}/`)
      .then(() => {
        dispatch(notifySuccess('Pomyślnie zweryfikowano piosenkę'));
        song && navigate(`/song/${song.slug}`);
      })
      .catch(() => {
        dispatch(notifyError('Niespodziewany błąd podczas odrzucania edycji piosenki'));
        setCanExit(false);
      });
  };

  return (
    <>
      <Stack direction="row" gap={1} justifyContent="space-between">
        <Stack direction="row" gap={1}>
          <ToggleButtonGroup
            color="primary"
            exclusive
            value={compare ? 'json' : 'preview'}
            onChange={(_, prev: string) => setCompare(prev !== 'preview')}
          >
            <ToggleButton value="preview">
              <Preview sx={{ mr: '0.3em' }} />
              Podgląd
            </ToggleButton>
            <ToggleButton value="json">
              <DataObject sx={{ mr: '0.3em' }} />
              JSON
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            color="primary"
            exclusive
            value={split ? 'split' : 'unified'}
            onChange={(_, prev: string) => setSplit(prev !== 'unified')}
          >
            <ToggleButton value="unified">
              <Reorder sx={{ mr: '0.3em' }} />
              Pojedynczo
            </ToggleButton>
            <ToggleButton value="split">
              <VerticalSplitOutlined sx={{ mr: '0.3em' }} />
              Porównanie
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Stack direction="row" gap={1}>
          <Button variant="outlined" size="large" onClick={() => updateStep(-1)} startIcon={<BackspaceOutlined />}>
            Wróć
          </Button>
          {verification && (
            <Button variant="outlined" size="large" onClick={rejectEdit} startIcon={<ThumbDown />}>
              Odrzuć
            </Button>
          )}
          <Button
            variant="contained"
            size="large"
            onClick={verification ? verify : save}
            endIcon={verification ? <ThumbUp /> : <SaveOutlined />}
            disabled={equals}
          >
            {verification ? 'Akceptuj' : 'Zapisz'}
          </Button>
        </Stack>
      </Stack>
      {compare ? (
        <DiffViewer
          oldValue={jsonOld}
          newValue={jsonNew}
          useDarkTheme={theme.palette.mode === 'dark'}
          leftTitle="Obecna wersja"
          rightTitle="Edytowana wersja"
          splitView={split}
          codeFoldMessageRenderer={(totalFoldedLines) => <>Rozwiń {totalFoldedLines} linii...</>}
        />
      ) : (
        <Stack direction="row" justifyContent="center" spacing={2}>
          {song && split && <Song song={song} preview />}
          <Song song={songPreview} preview />
        </Stack>
      )}
    </>
  );
};

export default SongEditSummary;

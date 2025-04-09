import { songToSongEdit, useSongEditContext } from '../SongEditContext.tsx';
import Song from '../../song/Song.tsx';
import { Button, Stack } from '@mui/material';
import { BackspaceOutlined, DataObject, VerticalSplitOutlined } from '@mui/icons-material';
import pako from 'pako';
import { useMemo, useState } from 'react';
import SongCompare from './SongCompare.tsx';
import { IAuthorEdit, ISlug, ISong } from '../../types/song.types.ts';

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

  const exportJSON = () => {
    const jsonString = JSON.stringify(songEdit);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  };

  const exportTargetFormat = () => {
    const json = JSON.stringify(songEdit.verses);
    const compressed = pako.gzip(json);
    const base64 = compressed.reduce<string>((str, byte) => str + String.fromCharCode(byte), '');
    const jsonString = JSON.stringify({ ...songEdit, verses: btoa(base64) });

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
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
        <Button variant="contained" size="large" onClick={exportTargetFormat} endIcon={<DataObject />}>
          Eksportuj (spakowane)
        </Button>
        <Button variant="contained" size="large" onClick={exportJSON} endIcon={<DataObject />}>
          Eksportuj
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

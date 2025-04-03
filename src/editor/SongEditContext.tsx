import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { ISong, ISongEdit } from '../types/song.types.ts';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { useParams } from 'react-router';
import { getSong } from '../store/songbook.actions.ts';

export type EditedDependent<Dependent> = Dependent & { editing?: boolean };

const songToSongEdit = (song: ISong): ISongEdit => {
  const edit: ISongEdit = {
    title: song.title,
    altTitle: song.altTitle,
    category: song.category,
    key: song.key,
    verses: song.verses,
    video: song.video,
  };
  if (song.lyrics?.length) edit.lyrics = { existing: song.lyrics.map((p) => p.slug) };
  if (song.composer?.length) edit.composer = { existing: song.composer.map((p) => p.slug) };
  if (song.translation?.length) edit.translation = { existing: song.translation.map((p) => p.slug) };
  if (song.performer?.length) edit.performer = { existing: song.performer.map((p) => p.slug) };
  if (song.source?.length) edit.source = { existing: song.source.map((s) => s.slug) };
  if (song.band) edit.band = { existing: song.band.slug };

  return edit;
};

export interface ISongEditContextProps<Optional extends boolean = false> {
  // Oryginalna piosenka
  song: Optional extends true ? ISong | undefined : ISong;
  songTimeout: boolean;
  songSlug?: string;
  needsAuthorEdit: boolean;
  setNeedsAuthorEdit: (needs: boolean) => void;
  activeStep: number;
  updateStep: (inc: number) => void;
  initial: boolean;
  setInitial: (initial: boolean) => void;

  resetSongInfo: () => void;

  // Edycja piosenki (w wersji ostatecznej, jeśli chodzi o informacje)
  songEdit: Optional extends true ? ISongEdit | undefined : ISongEdit;
  setSongEdit: (songEdit: ISongEdit) => void;
}

const SongEditContextComponent = (): ISongEditContextProps<true> => {
  const globalSong = useAppSelector((state) => state.song);
  const [initial, setInitial] = useState(true);
  const [song, setSong] = useState<ISong>();
  const [songEdit, setSongEdit] = useState<ISongEdit>();
  const [songTimeout, setSongTimeout] = useState(false);
  const [needsAuthorEdit, setNeedsAuthorEdit] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const { songSlug } = useParams();
  const dispatch = useAppDispatch();

  const handleSetSong = (song?: ISong) => {
    setSong(song);
    setSongTimeout(song === undefined);
    setSongEdit(song && songToSongEdit(song));
  };

  const resetSongInfo = () => {
    if (song && songEdit) {
      const newEdit = songToSongEdit(song);
      newEdit.verses = songEdit.verses;
      setSongEdit(newEdit);
    }
  };

  useEffect(() => {
    if (globalSong?.slug === songSlug) {
      handleSetSong(globalSong);
    } else if (songSlug) {
      setSongTimeout(false);
      dispatch(getSong(songSlug))
        .unwrap()
        .then(handleSetSong)
        .catch(() => handleSetSong());
    } else {
      handleSetSong();
    }
    setInitial(true);
    setActiveStep(0);
  }, [songSlug]);

  const updateStep = (inc: number) => {
    setActiveStep(activeStep + inc);
  };

  return {
    song,
    songTimeout,
    songSlug,
    activeStep,
    updateStep,
    needsAuthorEdit,
    setNeedsAuthorEdit,
    initial,
    setInitial,

    resetSongInfo,

    songEdit,
    setSongEdit,
  };
};

const SongEditContext = createContext({} as ISongEditContextProps<true>);

export const SongEditContextProvider = ({ children }: PropsWithChildren) => {
  return <SongEditContext.Provider value={SongEditContextComponent()}>{children}</SongEditContext.Provider>;
};

export const useOptionalSongEditContext = () => useContext(SongEditContext);
export const useSongEditContext = useOptionalSongEditContext as unknown as () => ISongEditContextProps;

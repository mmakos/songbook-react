import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { Category, IBandOverview, IPersonOverview, ISong, ISongEdit, ISourceOverview } from '../types/song.types.ts';
import { useAppDispatch } from '../store/songbook.store.ts';
import { useParams } from 'react-router';
import { getSong } from '../store/songbook.actions.ts';

export type EditedDependent<Dependent> = Dependent & { editing?: boolean };

export const songToSongEdit = (song: ISong | null): ISongEdit => {
  if (song === null)
    return {
      title: '',
      category: Category.OTHER,
      verses: [{ lines: [], indent: 0 }],
    };
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

type TSongNew<New extends boolean> = New extends true ? null : ISong;

interface IAuthorsCache {
  person: Record<string, IPersonOverview>;
  source: Record<string, ISourceOverview>;
  band?: IBandOverview;
}

export interface ISongEditContextProps<Optional extends boolean = false, New extends boolean = false> {
  // Oryginalna piosenka
  song: Optional extends true ? TSongNew<New> | undefined : TSongNew<New>;
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
  keyEdit: boolean;
  setKeyEdit: (edit: boolean) => void;
  textEdit: boolean;
  setTextEdit: (edit: boolean) => void;

  newSong: New;
  verification?: boolean;
  canExit: boolean;
  setCanExit: (canExit: boolean) => void;

  authorsCache: IAuthorsCache;
}

const SongEditContextComponent = <New extends boolean>(
  newSong: New,
  verification?: boolean
): ISongEditContextProps<true, New> => {
  const [initial, setInitial] = useState(true);
  const [song, setSong] = useState<TSongNew<New>>();
  const [songEdit, setSongEdit] = useState<ISongEdit>();
  const [songTimeout, setSongTimeout] = useState(false);
  const [needsAuthorEdit, setNeedsAuthorEdit] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [keyEdit, setKeyEdit] = useState<boolean>(newSong);
  const [textEdit, setTextEdit] = useState<boolean>(newSong);
  const [canExit, setCanExit] = useState(false);
  const authorsCache = useRef<IAuthorsCache>({ person: {}, source: {} });

  const { songSlug, username } = useParams();
  const dispatch = useAppDispatch();

  const updateCache = (song: ISong) => {
    song.composer?.forEach(p => authorsCache.current.person[p.slug] = p);
    song.lyrics?.forEach(p => authorsCache.current.person[p.slug] = p);
    song.translation?.forEach(p => authorsCache.current.person[p.slug] = p);
    song.performer?.forEach(p => authorsCache.current.person[p.slug] = p);
    song.source?.forEach(s => authorsCache.current.source[s.slug] = s);
    if (song.band) authorsCache.current.band = song.band;
  }

  const handleSetSong = (song?: ISong | null) => {
    setSong(song as TSongNew<New>);
    setSongTimeout(song === undefined);
    song && updateCache(song);
  };

  const handleSetUserSong = (song?: ISong | null) => {
    if (!verification) {
      setSong(song as TSongNew<New>);
    }
    setSongEdit(song !== undefined ? songToSongEdit(song) : undefined);
    setSongTimeout(song === undefined);
    song && updateCache(song);
  };

  const resetSongInfo = () => {
    if (song && songEdit) {
      const newEdit = songToSongEdit(song);
      newEdit.verses = songEdit.verses;
      setSongEdit(newEdit);
    }
  };

  useEffect(() => {
    if (!songSlug) {
      handleSetSong(newSong ? null : undefined);
    } else {
      setSongTimeout(false);
      dispatch(getSong({ slug: songSlug, username: username }))
        .unwrap()
        .then(handleSetUserSong)
        .catch(() => handleSetUserSong());
      if (verification) {
        dispatch(getSong({ slug: songSlug }))
          .unwrap()
          .then(handleSetSong)
          .catch(() => handleSetSong());
      }
    }
    setInitial(true);
    setActiveStep(verification ? 2 : 0);
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
    keyEdit,
    setKeyEdit,
    textEdit,
    setTextEdit,

    newSong,
    verification,
    canExit,
    setCanExit,

    authorsCache: authorsCache.current,
  };
};

const SongEditContext = createContext({} as ISongEditContextProps<true, boolean>);

export const SongEditContextProvider = <New extends boolean>({
  newSong,
  verification,
  children,
}: PropsWithChildren & { newSong: New; verification?: boolean }) => {
  return (
    <SongEditContext.Provider value={SongEditContextComponent(newSong, verification)}>
      {children}
    </SongEditContext.Provider>
  );
};

export const useOptionalSongEditContext = () => useContext(SongEditContext);
export const useSongEditContext = useOptionalSongEditContext as unknown as () => ISongEditContextProps<false, boolean>;

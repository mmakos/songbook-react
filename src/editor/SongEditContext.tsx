import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Category, IBand, IPerson, ISong, ISource } from '../types/song.types.ts';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { useParams } from 'react-router';
import { getSong } from '../store/songbook.actions.ts';

export type EditedDependent<Dependent> = Dependent & { editing?: boolean };

export interface ISongInfo {
  title: string;
  altTitle: string;
  category: Category;
  lyrics: (EditedDependent<IPerson> | string)[];
  composer: (EditedDependent<IPerson> | string)[];
  translation: (EditedDependent<IPerson> | string)[];
  performer: (EditedDependent<IPerson> | string)[];
  band: EditedDependent<IBand> | string | null;
  source: (EditedDependent<ISource> | string)[];
  videos: string[];
}

export interface ISongEditContextProps {
  song?: ISong;
  songTimeout: boolean;
  songSlug?: string;
  setSong: (song: ISong) => void;
  needsAuthorEdit: boolean;
  setNeedsAuthorEdit: (needs: boolean) => void;
  activeStep: number;
  updateStep: (inc: number) => void;
  initial: boolean;
  setInitial: (initial: boolean) => void;

  songInfo?: ISongInfo;
  setSongInfo: (info: ISongInfo) => void;
}

const SongEditContextComponent = (): ISongEditContextProps => {
  const globalSong = useAppSelector((state) => state.song);
  const [initial, setInitial] = useState(true);
  const [song, setSong] = useState<ISong>();
  const [songTimeout, setSongTimeout] = useState(false);
  const [needsAuthorEdit, setNeedsAuthorEdit] = useState(false);
  const [songInfo, setSongInfo] = useState<ISongInfo>();
  const [activeStep, setActiveStep] = useState(0);

  const { songSlug } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (globalSong?.slug === songSlug) {
      setSong(globalSong);
    } else if (songSlug) {
      setSongTimeout(false);
      dispatch(getSong(songSlug))
        .unwrap()
        .then(setSong)
        .catch(() => {
          setSong(undefined);
          setSongTimeout(true);
        });
    } else {
      setSongTimeout(true);
      setSong(undefined);
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
    setSong,
    activeStep,
    updateStep,
    needsAuthorEdit,
    setNeedsAuthorEdit,
    initial,
    setInitial,

    songInfo,
    setSongInfo,
  };
};

const SongEditContext = createContext({} as ISongEditContextProps);

export const SongEditContextProvider = ({ children }: PropsWithChildren) => {
  return <SongEditContext.Provider value={SongEditContextComponent()}>{children}</SongEditContext.Provider>;
};

export const useSongEditContext = () => useContext(SongEditContext);

import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { ISong } from '../types/song.types.ts';

export enum SongEditStep {
  INFO,
  AUTHORS,
  TEXT,
}

export interface ISongEditContextProps {
  song?: ISong;
  setSong: (song: ISong) => void;
  activeStep: SongEditStep;
}

const SongEditContextComponent = (): ISongEditContextProps => {
  const [song, setSong] = useState<ISong>();
  const [activeStep, setActiveStep] = useState<SongEditStep>(SongEditStep.INFO);

  return {
    song,
    setSong,
    activeStep,
  };
};

const SongEditContext = createContext({} as ISongEditContextProps);

export const SongEditContextProvider = ({ children }: PropsWithChildren) => {
  return <SongEditContext.Provider value={SongEditContextComponent()}>{children}</SongEditContext.Provider>;
};

export const useSongEditContext = () => useContext(SongEditContext);

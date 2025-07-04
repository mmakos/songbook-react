import { IFont } from '../components/font/FontChooser.tsx';
import { ISpacing } from '../components/font/FontSpacing.tsx';
import { IChordDifficulty, IFontStyles, ITextSettings } from '../store/songbook.reducer.ts';
import { useAppSelector } from '../store/songbook.store.ts';
import { TScale } from '../components/ScalableBox.tsx';
import { createContext, PropsWithChildren, useContext } from 'react';
import { ITransposition } from '../chords/chord-transposition.tsx';

export interface ISongContextProps {
  font?: IFont;
  spacing?: ISpacing;
  fontStyles: IFontStyles;
  textSettings: ITextSettings;
  chordDifficulty: IChordDifficulty;
  transposition: ITransposition;
  zoom: TScale;
  showChords: boolean;
  noChords: boolean;
}

const GlobalSongContextComponent = (): ISongContextProps => {
  // Te pobieramy oddzielnie, bo są w widoku piosenki, więc muszą działać refreshe
  const showChords = useAppSelector(state => state.songSettings.showChords);
  const chordDifficulty = useAppSelector(state => state.songSettings.chordDifficulty);
  const transposition = useAppSelector(state => state.songSettings.transposition);
  // Tu wyciągamy cały obiekt, bo nie potrzebujemy refreshy, bo jak mamy ustawienia śpiewnika, to nie wyświetlamy piosenki
  const {
    noChords,
    textSettings,
    songTheme: { font, customFont, spacing, customSpacing, fontStyles },
  } = useAppSelector((state) => state.songbookSettings);
  const zoom = useAppSelector((state) => state.songDisplayState.zoom);

  return {
    font: customFont ? font : undefined,
    spacing: customSpacing ? spacing : undefined,
    fontStyles,
    textSettings,
    chordDifficulty,
    transposition,
    zoom,
    showChords: !!showChords,
    noChords: !!noChords,
  };
};

export const SongContext = createContext({} as ISongContextProps);

export const GlobalSongContextProvider = ({ children }: PropsWithChildren) => {
  return <SongContext.Provider value={GlobalSongContextComponent()}>{children}</SongContext.Provider>;
};

export const useSongContext = () => useContext(SongContext);

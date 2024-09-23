import { Accidental, ICategorizedSongOverview, ISong, ISongOverview } from '../types/song.types.ts';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAutocomplete, fetchSongList, getSong } from './songbook.actions.ts';
import { AlertColor, AlertPropsColorOverrides, PaletteMode } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { hard } from '../chords/chord-difficulty.tsx';
import { IFont } from '../components/FontChooser.tsx';
import { getTranspositionBetweenNotes, ITransposition } from '../chords/chord-transposition.tsx';

export interface INotificationState {
  open?: boolean;
  message: string;
  severity: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;
}

export interface IChordDifficulty {
  hideUncommonAdditionals?: boolean;
  guitarIntervalModifications?: boolean;
  splitSuspensions?: boolean;
  hideUnisonAndFifth?: boolean;
  singleAdditional?: boolean;
  guitarDiminishedChords?: boolean;
  hideBase?: boolean;
  hideBaseAdditional?: boolean;
  hideAlternatives?: boolean;
  signAccidentals?: boolean;
}

export interface ISongSettings {
  transposition: ITransposition;
  chordDifficulty: IChordDifficulty;
  showChords?: boolean;
}

export interface ISongbookSettings {
  noChords?: boolean;
}

export interface ISongDisplayState {
  settingsOpen?: boolean;
  infoOpen?: boolean;
  expandVerses?: boolean;
  hoverExpandVerses?: boolean;
}

export interface ISearchState {
  autocomplete?: ICategorizedSongOverview[];
  autocompleteLoad?: boolean;
}

export interface ISongTheme {
  mode?: PaletteMode;
  font?: IFont;
}

export interface ISongbookState {
  songs?: ISongOverview[];
  song?: ISong;
  notification: INotificationState;
  searchState: ISearchState;
  songDisplayState: ISongDisplayState;
  songSettings: ISongSettings;
  globalSongSettings: ISongSettings;
  songbookSettings: ISongbookSettings;
  theme: PaletteMode;
  songTheme: ISongTheme;
}

let initialSongSettings: ISongSettings = {
  transposition: { amount: 0 },
  chordDifficulty: hard,
  showChords: true,
};

const storageSettings = localStorage.getItem('songSettings');
if (storageSettings) {
  try {
    const parsed = JSON.parse(storageSettings);
    initialSongSettings = { ...initialSongSettings, ...parsed };
  } catch (exception) {
    console.log(exception);
  }
}

const initialSongbookState: ISongbookState = {
  notification: {
    message: '',
    severity: 'success',
  },
  searchState: {},
  songDisplayState: {},
  songSettings: initialSongSettings,
  globalSongSettings: initialSongSettings,
  songbookSettings: {},
  theme: 'dark',
  songTheme: {},
};

const songbookSlice = createSlice({
  name: 'songbook',
  initialState: initialSongbookState,
  reducers: {
    clearSong: (state) => {
      state.song = undefined;
      state.songSettings = { ...state.globalSongSettings, transposition: { amount: 0 } };
    },
    setSongSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.songDisplayState.settingsOpen = action.payload;
    },
    setSongInfoOpen: (state, action: PayloadAction<boolean>) => {
      state.songDisplayState.infoOpen = action.payload;
    },
    notifySuccess: (state, action: PayloadAction<string>) => {
      state.notification = {
        open: true,
        message: action.payload,
        severity: 'success',
      };
    },
    closeNotification: (state) => {
      state.notification.open = false;
    },
    transposeUp: (state) => {
      state.songSettings.transposition = {
        amount: state.songSettings.transposition.amount + 1,
        type: Accidental.SHARP,
      };
    },
    transposeDown: (state) => {
      state.songSettings.transposition = {
        amount: state.songSettings.transposition.amount - 1,
        type: Accidental.FLAT,
      };
    },
    resetTransposition: (state) => {
      state.songSettings.transposition = {
        amount: 0,
      };
    },
    transposeToComfort: (state) => {
      const comfort = state.song?.key.comfort.note;
      if (!comfort) return;
      state.songSettings.transposition = getTranspositionBetweenNotes(state.song.key.songbook.note, comfort);
    },
    transposeToOriginal: (state) => {
      const original = state.song?.key.original.note;
      if (!original) return;
      state.songSettings.transposition = getTranspositionBetweenNotes(state.song.key.songbook.note, original);
    },
    changeDifficulty: (state, action: PayloadAction<IChordDifficulty>) => {
      state.songSettings.chordDifficulty = { ...state.songSettings.chordDifficulty, ...action.payload };
    },
    setShowChords: (state, action: PayloadAction<boolean>) => {
      console.log(state.songSettings.showChords);
      state.songSettings.showChords = action.payload;
    },
    setHoverExpandVerses: (state, action: PayloadAction<boolean>) => {
      state.songDisplayState.hoverExpandVerses = action.payload;
    },
    setExpandVerses: (state, action: PayloadAction<boolean>) => {
      state.songDisplayState.expandVerses = action.payload;
    },
    updateGlobalSettings: (state) => {
      state.globalSongSettings = state.songSettings;
      localStorage.setItem('songSettings', JSON.stringify(state.globalSongSettings));
      state.notification = { open: true, message: 'Zaktualizowano globalne ustawienia', severity: 'success' };
    },
    changeTheme: (state, action: PayloadAction<PaletteMode>) => {
      state.theme = action.payload;
    },
    setAutocompleteLoad: (state) => {
      state.searchState.autocompleteLoad = true;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSongList.fulfilled, (state, action) => {
      state.songs = action.payload;
    });
    builder.addCase(getSong.fulfilled, (state, action) => {
      state.song = action.payload;
    });
    builder.addCase(getAutocomplete.fulfilled, (state, action) => {
      state.searchState.autocomplete = action.payload;
      state.searchState.autocompleteLoad = false;
    });
  },
});
export const {
  clearSong,
  setSongSettingsOpen,
  setSongInfoOpen,
  closeNotification,
  notifySuccess,
  transposeUp,
  transposeDown,
  resetTransposition,
  transposeToComfort,
  transposeToOriginal,
  changeDifficulty,
  setShowChords,
  setHoverExpandVerses,
  setExpandVerses,
  updateGlobalSettings,
  changeTheme,
  setAutocompleteLoad,
  clearAutocomplete
} = songbookSlice.actions;

export default songbookSlice.reducer;

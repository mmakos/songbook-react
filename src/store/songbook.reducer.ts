import {Accidental, ISong} from '../types/song.types.ts';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getAndSaveSong} from './songbook.actions.ts';
import {AlertColor, AlertPropsColorOverrides, PaletteMode} from '@mui/material';
import {OverridableStringUnion} from '@mui/types';
import {expert} from '../chords/chord-difficulty.tsx';
import {FontFamily, IFont} from '../components/font/FontChooser.tsx';
import {getTranspositionBetweenNotes, ITransposition} from '../chords/chord-transposition.tsx';
import {IFontStyle} from '../components/font/FontStyle.tsx';
import {ISpacing} from '../components/font/FontSpacing.tsx';
import {TScale} from '../components/ScalableBox.tsx';
import {
  getBoolFromStorage,
  getNumberFromStorage,
  getObjectFromStorage,
  getStringFromStorage,
  saveObjectToStorage,
  saveSimpleToStorage,
  saveStringToStorage,
} from './local-storage.utils.ts';
import {IUser} from '../user/user.types.ts';
import {IMeeting} from '../meeting/meeting.types.tsx';

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
  hideAlternativesColumn?: boolean;
  signAccidentals?: boolean;
  hideAdditionals269?: boolean;
  hideFourths?: boolean;
  enharmonicFlats?: boolean;
  enharmonicSharps?: boolean;
  americanNotation?: boolean;
}

export interface ITextSettings {
  hideNonLiteral?: boolean;
  hideNonLiteralSuffix?: boolean;
  hideNonLiteralPrefix?: boolean;
  capitalize?: boolean;
  numberVerses?: boolean;
}

export interface IMeetingSettings {
  showHiddenSongs?: boolean;
  showUserInfo?: boolean;
}

export interface ISongSettings {
  transposition: ITransposition;
  chordDifficulty: IChordDifficulty;
  showChords?: boolean;
}

export interface ISongbookSettings {
  noChordInfo?: boolean;
  noChords?: boolean;
  chordDifficulty: IChordDifficulty;
  textSettings: ITextSettings;
  songTheme: ISongTheme;
  meetingSettings: IMeetingSettings;
  songListGrid?: boolean;
}

export interface ISongDisplayState {
  settingsOpen?: boolean;
  infoOpen?: boolean;
  videoOpen?: boolean;
  expandVerses?: boolean;
  hoverExpandVerses?: boolean;
  zoom?: TScale;
}

export interface ISongTheme {
  mode?: PaletteMode;
  customFont?: boolean;
  font: IFont;
  customSpacing?: boolean;
  spacing: ISpacing;
  fontStyles: IFontStyles;
}

export interface IFontStyles {
  text: IFontStyle;
  text1: IFontStyle;
  text2: IFontStyle;
  text3: IFontStyle;
  repetition: IFontStyle;
  chords: IFontStyle;
  silentChords: IFontStyle;
}

/**
 * Główny stan aplikacji - śpiewnika (root reducera)
 */
export interface ISongbookState {
  /**
   * Obecnie wyświetlana piosenka
   */
  song?: ISong;
  /**
   * Czy poszedł timeout dla pobierania piosenki
   */
  songTimeout?: boolean;
  /**
   * Powiadomienia dla użytkownika
   */
  notification: INotificationState;
  /**
   * Stan wyświetlenej piosenki, np. czy są rozwinięte informacje o piosence lub ustawienia
   */
  songDisplayState: ISongDisplayState;
  /**
   * Ustawienia piosenki (te co w oknie ustawień)
   */
  songSettings: ISongSettings;
  /**
   * Ustawienia śpiewnika (wszystko co jest w oknie ustawień)
   */
  songbookSettings: ISongbookSettings;
  theme?: PaletteMode;
  /**
   * Dane o zalogowanym użytkowniku
   */
  user?: IUser | null;
  meeting: { meeting?: IMeeting; id?: number };
  accessToken?: string;
}

const initialChordDifficulty = {...expert, ...getObjectFromStorage('chord-difficulty')};

export const initialSpacing: ISpacing = {
  lineHeight: 1.5,
  verseSpacing: 0.7,
  verseIndent: 3,
  repetitionSpacing: 1,
  chordsSpacing: 5,
};

export const initialSongbookState: ISongbookState = {
  notification: {
    message: '',
    severity: 'success',
  },
  songDisplayState: {
    videoOpen: getBoolFromStorage('video-open'),
    infoOpen: getBoolFromStorage('info-open') ?? true,
    settingsOpen: getBoolFromStorage('settings-open') ?? true,
    expandVerses: getBoolFromStorage('expand-verses'),
  },
  theme: (getStringFromStorage('theme') as PaletteMode) ?? 'dark',
  songSettings: {
    transposition: {amount: 0},
    chordDifficulty: initialChordDifficulty,
    showChords: !getBoolFromStorage('no-chords'),
  },
  songbookSettings: {
    chordDifficulty: initialChordDifficulty,
    textSettings: {capitalize: true, ...getObjectFromStorage('text-settings')},
    songTheme: {
      fontStyles: {
        text: getObjectFromStorage('song-theme-text-style'),
        text1: {italic: true, ...getObjectFromStorage('song-theme-text1-style')},
        text2: {underline: true, ...getObjectFromStorage('song-theme-text2-style')},
        text3: {bold: true, ...getObjectFromStorage('song-theme-text3-style')},
        repetition: {bold: true, ...getObjectFromStorage('song-theme-repetition-style')},
        chords: {bold: true, ...getObjectFromStorage('song-theme-chords-style')},
        silentChords: {bold: true, italic: true, ...getObjectFromStorage('song-theme-silent-chords-style')},
      },
      font: {
        fontFamily: FontFamily.VERDANA,
        fontSize: 14,
        ...getObjectFromStorage('song-theme-font'),
      },
      customFont: getBoolFromStorage('song-theme-custom-font'),
      spacing: {
        ...initialSpacing,
        ...getObjectFromStorage('song-theme-spacing'),
      },
      mode: getStringFromStorage('song-theme-mode') as PaletteMode,
      customSpacing: getBoolFromStorage('song-theme-custom-spacing'),
    },
    noChordInfo: getBoolFromStorage('no-chord-info'),
    noChords: getBoolFromStorage('no-chords'),
    meetingSettings: getObjectFromStorage('meeting-settings'),
    songListGrid: getBoolFromStorage('song-list-grid'),
  },
  meeting: {id: getNumberFromStorage('meeting-id')},
};

const songbookSlice = createSlice({
  name: 'songbook',
  initialState: initialSongbookState,
  reducers: {
    updateSong: (state: ISongbookState, action: PayloadAction<ISong>) => {
      state.song = action.payload;
    },
    clearSong: (state: ISongbookState) => {
      delete state.song;
      state.songSettings = {
        showChords: !state.songbookSettings.noChords,
        chordDifficulty: state.songbookSettings.chordDifficulty,
        transposition: {amount: 0},
      };
    },
    setSongSettingsOpen: (state: ISongbookState, action: PayloadAction<boolean>) => {
      state.songDisplayState.settingsOpen = action.payload;
      saveSimpleToStorage('settings-open', action.payload);
    },
    setSongInfoOpen: (state: ISongbookState, action: PayloadAction<boolean>) => {
      state.songDisplayState.infoOpen = action.payload;
      saveSimpleToStorage('info-open', action.payload);
    },
    setSongVideoOpen: (state: ISongbookState, action: PayloadAction<boolean>) => {
      state.songDisplayState.videoOpen = action.payload;
      saveSimpleToStorage('video-open', action.payload);
    },
    notifySuccess: (state: ISongbookState, action: PayloadAction<string>) => {
      state.notification = {
        open: true,
        message: action.payload,
        severity: 'success',
      };
    },
    notifyError: (state: ISongbookState, action: PayloadAction<string>) => {
      state.notification = {
        open: true,
        message: action.payload,
        severity: 'error',
      };
    },
    closeNotification: (state: ISongbookState) => {
      state.notification.open = false;
    },
    transposeUp: (state: ISongbookState) => {
      state.songSettings.transposition = {
        amount: state.songSettings.transposition.amount + 1,
        type: Accidental.SHARP,
      };
    },
    transposeDown: (state: ISongbookState) => {
      state.songSettings.transposition = {
        amount: state.songSettings.transposition.amount - 1,
        type: Accidental.FLAT,
      };
    },
    resetTransposition: (state: ISongbookState) => {
      state.songSettings.transposition = {
        amount: 0,
      };
    },
    transposeToComfort: (state: ISongbookState) => {
      const comfort = state.song?.key?.comfort?.note;
      if (!comfort) return;
      state.songSettings.transposition = getTranspositionBetweenNotes(state.song!.key!.songbook.note, comfort);
    },
    transposeToOriginal: (state: ISongbookState) => {
      const original = state.song?.key?.original?.note;
      if (!original) return;
      state.songSettings.transposition = getTranspositionBetweenNotes(state.song!.key!.songbook.note, original);
    },
    changeSongChordsDifficulty: (state: ISongbookState, action: PayloadAction<IChordDifficulty>) => {
      state.songSettings.chordDifficulty = {...state.songSettings.chordDifficulty, ...action.payload};
    },
    setShowChords: (state: ISongbookState, action: PayloadAction<boolean>) => {
      state.songSettings.showChords = action.payload;
    },
    setHoverExpandVerses: (state: ISongbookState, action: PayloadAction<boolean>) => {
      state.songDisplayState.hoverExpandVerses = action.payload;
    },
    setExpandVerses: (state: ISongbookState, action: PayloadAction<boolean>) => {
      state.songDisplayState.expandVerses = action.payload;
      saveSimpleToStorage('expand-verses', action.payload);
    },
    updateGlobalSettingsWithSongSettings: (state: ISongbookState) => {
      setGlobalChordsDifficulty(state.songSettings.chordDifficulty);
      setNoChords(!state.songSettings.showChords);
      state.notification = {open: true, message: 'Zaktualizowano globalne ustawienia', severity: 'success'};
    },
    changeTheme: (state: ISongbookState, action: PayloadAction<PaletteMode | undefined>) => {
      state.theme = action.payload;
      saveStringToStorage('theme', action.payload);
    },

    setSongThemeMode: (state: ISongbookState, action: PayloadAction<PaletteMode | undefined>) => {
      state.songbookSettings.songTheme.mode = action.payload;
      saveStringToStorage('song-theme-mode', action.payload);
    },
    setSongThemeFont: (state: ISongbookState, action: PayloadAction<IFont>) => {
      state.songbookSettings.songTheme.font = action.payload;
      saveObjectToStorage('song-theme-font', action.payload);
    },
    setSongThemeCustomFont: (state: ISongbookState, action: PayloadAction<boolean>) => {
      state.songbookSettings.songTheme.customFont = action.payload;
      saveSimpleToStorage('song-theme-custom-font', action.payload);
    },
    setSongThemeFontStyles: (state: ISongbookState, action: PayloadAction<IFontStyles>) => {
      state.songbookSettings.songTheme.fontStyles = action.payload;
      saveObjectToStorage('song-theme-text-style', action.payload.text);
      saveObjectToStorage('song-theme-text1-style', action.payload.text1);
      saveObjectToStorage('song-theme-text2-style', action.payload.text2);
      saveObjectToStorage('song-theme-text3-style', action.payload.text3);
      saveObjectToStorage('song-theme-repetition-style', action.payload.repetition);
      saveObjectToStorage('song-theme-chords-style', action.payload.chords);
      saveObjectToStorage('song-theme-silent-chords-style', action.payload.silentChords);
    },
    setSongThemeCustomSpacing: (state: ISongbookState, action: PayloadAction<boolean>) => {
      state.songbookSettings.songTheme.customSpacing = action.payload;
      saveSimpleToStorage('song-theme-custom-spacing', action.payload);
    },
    setSongThemeSpacing: (state: ISongbookState, action: PayloadAction<ISpacing>) => {
      state.songbookSettings.songTheme.spacing = action.payload;
      saveObjectToStorage('song-theme-spacing', action.payload);
    },
    setTextSettings: (state: ISongbookState, action: PayloadAction<ITextSettings>) => {
      state.songbookSettings.textSettings = action.payload;
      saveObjectToStorage('text-settings', action.payload);
    },
    setNoChordInfo: (state: ISongbookState, action: PayloadAction<boolean>) => {
      state.songbookSettings.noChordInfo = action.payload;
      saveSimpleToStorage('no-chord-info', action.payload);
    },
    setNoChords: (state: ISongbookState, action: PayloadAction<boolean>) => {
      state.songbookSettings.noChords = action.payload;
      saveSimpleToStorage('no-chords', action.payload);
    },
    setGlobalChordsDifficulty: (state: ISongbookState, action: PayloadAction<IChordDifficulty>) => {
      state.songbookSettings.chordDifficulty = {...state.songbookSettings.chordDifficulty, ...action.payload};
      saveObjectToStorage('chord-difficulty', state.songbookSettings.chordDifficulty);
    },

    changeZoom: (state: ISongbookState, action: PayloadAction<TScale>) => {
      state.songDisplayState.zoom = action.payload;
    },
    resetSongTimeout: (state: ISongbookState) => {
      state.songTimeout = false;
    },

    setUser: (state: ISongbookState, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
    setAccessToken: (state: ISongbookState, action: PayloadAction<string | undefined>) => {
      state.accessToken = action.payload;
    },
    setCurrentMeeting: (state: ISongbookState, action: PayloadAction<number | undefined>) => {
      state.meeting.id = action.payload;
      saveSimpleToStorage('meeting-id', action.payload);
      if (action.payload === undefined) {
        delete state.meeting.meeting;
      }
    },
    setMeeting: (state: ISongbookState, action: PayloadAction<IMeeting | undefined>) => {
      state.meeting.meeting = action.payload;
    },
    setMeetingSettings: (state: ISongbookState, action: PayloadAction<IMeetingSettings>) => {
      state.songbookSettings.meetingSettings = action.payload;
      saveObjectToStorage('meeting-settings', action.payload);
    },
    setSongListGrid: (state: ISongbookState, action: PayloadAction<boolean | undefined>) => {
      state.songbookSettings.songListGrid = action.payload;
      saveSimpleToStorage('song-list-grid', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAndSaveSong.fulfilled, (state: ISongbookState, action) => {
      state.song = action.payload;
    });
    builder.addCase(getAndSaveSong.rejected, (state: ISongbookState) => {
      state.songTimeout = true;
    });
  },
});
export const {
  updateSong,
  clearSong,
  setSongSettingsOpen,
  setSongInfoOpen,
  setSongVideoOpen,
  closeNotification,
  notifySuccess,
  notifyError,
  transposeUp,
  transposeDown,
  resetTransposition,
  transposeToComfort,
  transposeToOriginal,
  changeSongChordsDifficulty,
  setShowChords,
  setHoverExpandVerses,
  setExpandVerses,
  updateGlobalSettingsWithSongSettings,
  changeTheme,
  setSongThemeMode,
  setSongThemeFont,
  setSongThemeCustomFont,
  setSongThemeSpacing,
  setSongThemeCustomSpacing,
  setSongThemeFontStyles,
  setTextSettings,
  setNoChordInfo,
  setNoChords,
  setGlobalChordsDifficulty,
  changeZoom,
  resetSongTimeout,
  setUser,
  setAccessToken,
  setCurrentMeeting,
  setMeeting,
  setMeetingSettings,
  setSongListGrid,
} = songbookSlice.actions;

export default songbookSlice.reducer;

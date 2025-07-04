import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { IChordDifficulty, IFontStyles, ITextSettings } from '../../store/songbook.reducer.ts';
import { IFont } from '../../components/font/FontChooser.tsx';
import { ISpacing } from '../../components/font/FontSpacing.tsx';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';
import { IMeeting, IMeetingExportSong } from '../meeting.types.tsx';
import { useParams } from 'react-router';
import useAuthAPI from '../../http/useAuthAPI.ts';
import { getSong } from '../../store/songbook.actions.ts';
import { defaultAuthorsSettings, IAuthorsSettings } from './ExportAuthorsSettings.tsx';
import { ISectionOptions } from 'docx';

type TExportStage = 'edit' | 'export';

export interface IExportMeetingContextProps<Optional extends boolean = false> {
  meeting: Optional extends true ? IMeeting | null | undefined : IMeeting;
  fetchSong: (song: IMeetingExportSong) => Promise<IMeetingExportSong>;
  stage: TExportStage;
  setStage: (stage: TExportStage) => void;

  font: IFont;
  setFont: (font: IFont) => void;
  spacing: ISpacing;
  setSpacing: (spacing: ISpacing) => void;
  fontStyles: IFontStyles;
  setFontStyles: (fontStyles: IFontStyles) => void;
  textSettings: ITextSettings;
  setTextSettings: (textSettings: ITextSettings) => void;
  showChords: boolean;
  setShowChords: (showChords: boolean) => void;
  chordDifficulty: IChordDifficulty;
  setChordDifficulty: (chordDifficulty: IChordDifficulty) => void;
  authorsSettings: IAuthorsSettings;
  setAuthorsSettings: (authorsSettings: IAuthorsSettings) => void;

  convertedSongs: Record<string, ISectionOptions>;
}

const ExportMeetingContextComponent = (): IExportMeetingContextProps<true> => {
  const {
    font: globalFont,
    fontStyles: globalFontStyles,
    spacing: globalSpacing,
  } = useAppSelector((state) => state.songbookSettings.songTheme);
  const globalChordDifficulty = useAppSelector((state) => state.songbookSettings.chordDifficulty);
  const globalNoChords = useAppSelector((state) => state.songbookSettings.noChords);
  const globalTextSettings = useAppSelector((state) => state.songbookSettings.textSettings);
  const { meetingId } = useParams();
  const authAPI = useAuthAPI();
  const dispatch = useAppDispatch();

  const [meeting, setMeeting] = useState<IMeeting | null>();
  const [font, setFont] = useState<IFont>(globalFont);
  const [spacing, setSpacing] = useState<ISpacing>(globalSpacing);
  const [fontStyles, setFontStyles] = useState<IFontStyles>(globalFontStyles);
  const [textSettings, setTextSettings] = useState<ITextSettings>(globalTextSettings);
  const [showChords, setShowChords] = useState<boolean>(!globalNoChords);
  const [chordDifficulty, setChordDifficulty] = useState<IChordDifficulty>(globalChordDifficulty);
  const [authorsSettings, setAuthorsSettings] = useState<IAuthorsSettings>(defaultAuthorsSettings);
  const [stage, setStage] = useState<TExportStage>('edit');

  const convertedSongs = useRef<Record<string, ISectionOptions>>({});

  useEffect(() => {
    setMeeting(undefined);
    authAPI
      .get(`meeting/${meetingId}/`)
      .then(({ data }) => setMeeting(data))
      .catch(() => setMeeting(null));
  }, [meetingId, authAPI]);

  const updateSong = (song: IMeetingExportSong) => {
    setMeeting({ ...meeting!, songs: meeting!.songs.map((s) => (s.slug === song.slug ? song : s)) });
    return song;
  };

  const fetchSong = (song: IMeetingExportSong) => {
    return dispatch(getSong({ slug: song.slug }))
      .unwrap()
      .then((s) => updateSong({ ...song, fullSong: s }));
  };

  return {
    meeting,
    fetchSong,
    stage,
    setStage,

    font,
    setFont,
    spacing,
    setSpacing,
    fontStyles,
    setFontStyles,
    textSettings,
    setTextSettings,
    showChords,
    setShowChords,
    chordDifficulty,
    setChordDifficulty,
    authorsSettings,
    setAuthorsSettings,

    convertedSongs: convertedSongs.current
  };
};

const ExportMeetingContext = createContext({} as IExportMeetingContextProps<true>);

export const ExportMeetingContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <ExportMeetingContext.Provider value={ExportMeetingContextComponent()}>{children}</ExportMeetingContext.Provider>
  );
};

export const useOptionalExportMeetingContext = () => useContext(ExportMeetingContext);
export const useExportMeetingContext = useOptionalExportMeetingContext as unknown as () => IExportMeetingContextProps;

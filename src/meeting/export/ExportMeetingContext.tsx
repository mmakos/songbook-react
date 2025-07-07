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
import { chToPt, emToPt, pxToPt } from '../../components/font/font.utils.ts';
import { useNavigate } from 'react-router-dom';

type TExportStage = 'edit' | 'download';

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

const fontFactory = (globalFont: IFont) => (): IFont => ({
  fontFamily: globalFont.fontFamily,
  fontSize: pxToPt(globalFont.fontSize),
  pt: true,
});

const spacingFactory = (globalSpacing: ISpacing, globalFont: IFont) => (): ISpacing => ({
  lineHeight: globalSpacing.lineHeight,
  verseSpacing: emToPt(globalSpacing.verseSpacing, globalFont.fontSize),
  repetitionSpacing: chToPt(globalSpacing.repetitionSpacing, globalFont.fontSize),
  chordsSpacing: chToPt(globalSpacing.chordsSpacing, globalFont.fontSize),
  verseIndent: chToPt(globalSpacing.verseIndent, globalFont.fontSize),
  pt: true,
});

const ExportMeetingContextComponent = (): IExportMeetingContextProps<true> => {
  const {
    font: globalFont,
    fontStyles: globalFontStyles,
    spacing: globalSpacing,
  } = useAppSelector((state) => state.songbookSettings.songTheme);
  const globalChordDifficulty = useAppSelector((state) => state.songbookSettings.chordDifficulty);
  const globalNoChords = useAppSelector((state) => state.songbookSettings.noChords);
  const globalTextSettings = useAppSelector((state) => state.songbookSettings.textSettings);
  const { meetingId, stage } = useParams();
  const authAPI = useAuthAPI();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [meeting, setMeeting] = useState<IMeeting | null>();
  const [font, setFont] = useState<IFont>(fontFactory(globalFont));
  const [spacing, setSpacing] = useState<ISpacing>(spacingFactory(globalSpacing, globalFont));
  const [fontStyles, setFontStyles] = useState<IFontStyles>(globalFontStyles);
  const [textSettings, setTextSettings] = useState<ITextSettings>(globalTextSettings);
  const [showChords, setShowChords] = useState<boolean>(!globalNoChords);
  const [chordDifficulty, setChordDifficulty] = useState<IChordDifficulty>(globalChordDifficulty);
  const [authorsSettings, setAuthorsSettings] = useState<IAuthorsSettings>(defaultAuthorsSettings);

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

  const handleSetStage = (stage: TExportStage) => {
    navigate(`/export/meeting/${meetingId}/${stage}`);
  };

  return {
    meeting,
    fetchSong,
    stage: stage as TExportStage,
    setStage: handleSetStage,

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

    convertedSongs: convertedSongs.current,
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

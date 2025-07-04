import { ISongContextProps, SongContext } from '../../song/SongContext.tsx';
import { PropsWithChildren } from 'react';
import { useExportMeetingContext } from './ExportMeetingContext.tsx';
import { IMeetingExportSong } from '../meeting.types.tsx';

interface IExportMeetingSongContextProps {
  song: IMeetingExportSong;
}

const ExportMeetingSongContextComponent = (song: IMeetingExportSong): ISongContextProps => {
  const { font, spacing, fontStyles, textSettings, showChords, chordDifficulty } = useExportMeetingContext();

  return {
    font,
    spacing,
    fontStyles,
    textSettings,
    chordDifficulty: song.chordDifficulty ?? chordDifficulty,
    transposition: song.transposition ?? { amount: 0 },
    zoom: 'normal',
    showChords: song.showChords ?? showChords,
    noChords: false,
  };
};

export const ExportMeetingSongContextProvider = ({
  song,
  children,
}: PropsWithChildren & IExportMeetingSongContextProps) => {
  return <SongContext.Provider value={ExportMeetingSongContextComponent(song)}>{children}</SongContext.Provider>;
};

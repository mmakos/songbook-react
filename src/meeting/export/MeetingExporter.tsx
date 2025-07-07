import { LinearProgress, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useExportMeetingContext } from './ExportMeetingContext.tsx';
import { IMeetingExportDownloadedSong, IMeetingExportSong } from '../meeting.types.tsx';
import MeetingDownloader from './MeetingDownloader.tsx';
import { DocxSongConverter } from './docx.converter.ts';

const MeetingExporter = () => {
  const context = useExportMeetingContext();
  const { meeting, convertedSongs, fetchSong } = context;
  const [info, setInfo] = useState<string>();
  const allDownloaded = useMemo(
    () => Object.keys(convertedSongs).length === meeting.songs.length,
    [meeting, convertedSongs]
  );

  useEffect(() => {
    meeting.songs.forEach((song: IMeetingExportSong) => {
      if (song.fullSong) {
        convertedSongs[song.slug] = new DocxSongConverter(song as IMeetingExportDownloadedSong, context).convertSong();
      } else {
        fetchSong(song).then((fetchedSong) => {
          convertedSongs[song.slug] = new DocxSongConverter(
            fetchedSong as IMeetingExportDownloadedSong,
            context
          ).convertSong();
          setInfo(`Pobieram i konwertuję piosenkę „${song.title}”`);
        });
      }
    });
  }, []);

  const progress = (Object.keys(convertedSongs).length / meeting.songs.length) * 100;

  return (
    <Stack spacing={2}>
      <Typography variant="h6">
        {allDownloaded ? 'Twój śpiewnik jest gotowy do pobrania 😎' : 'Tworzę twój śpiewnik, poczekaj chwilkę… 😴'}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        <LinearProgress variant="determinate" value={progress} sx={{ flexGrow: 1 }} />
        <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
      </Stack>
      {info && !allDownloaded && <Typography color="text.secondary">{info}</Typography>}
      {allDownloaded && <MeetingDownloader />}
    </Stack>
  );
};

export default MeetingExporter;

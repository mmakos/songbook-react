import { LinearProgress, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useExportMeetingContext } from './ExportMeetingContext.tsx';
import { IMeetingExportDownloadedSong, IMeetingExportSong } from '../meeting.types.tsx';
import { convertSong } from './docx.converter.ts';
import MeetingDownloader from './MeetingDownloader.tsx';

const MeetingExporter = () => {
  const context = useExportMeetingContext();
  const [info, setInfo] = useState<string>();
  const meeting = context.meeting;
  const allDownloaded = useMemo(
    () => Object.keys(context.convertedSongs).length === meeting.songs.length,
    [meeting, context.convertedSongs]
  );

  useEffect(() => {
    meeting.songs.forEach((song: IMeetingExportSong) => {
      if (song.fullSong) {
        context.convertedSongs[song.slug] = convertSong(song as IMeetingExportDownloadedSong);
      } else {
        context.fetchSong(song).then((fetchedSong) => {
          context.convertedSongs[song.slug] = convertSong(fetchedSong as IMeetingExportDownloadedSong);
          setInfo(`Pobieram i konwertuję piosenkę „${song.title}”`);
        });
      }
    });
  }, []);

  const progress = (Object.keys(context.convertedSongs).length / meeting.songs.length) * 100;

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

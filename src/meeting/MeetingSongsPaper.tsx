import { FormControlLabel, Paper, Stack, Switch, Typography } from '@mui/material';
import SyncButton from '../components/SyncButton.tsx';
import MeetingSongs from './MeetingSongs.tsx';
import { FC, useState } from 'react';
import { IMeeting, IMeetingSong } from './meeting.types.tsx';
import useAuthAPI from '../http/useAuthAPI.ts';

interface IMeetingSongsPaperProps {
  meeting: IMeeting;
  songsFetched: (songs: IMeetingSong[]) => void;
  showName?: boolean;
}

const MeetingSongsPaper: FC<IMeetingSongsPaperProps> = ({ meeting, songsFetched, showName }) => {
  const [fetchingSongs, setFetchingSongs] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(true);
  const authAPI = useAuthAPI();

  const fetchSongs = () => {
    setFetchingSongs(true);
    authAPI
      .get(`meeting/${meeting.id}/songs/`)
      .then(({ data }) => songsFetched(data.songs))
      .finally(() => setFetchingSongs(false));
  };

  return (
    <Paper sx={{ p: '1em', flexGrow: 1 }}>
      <Stack spacing={1} useFlexGap height="100%">
        <Stack>
          <Typography variant="h6" display="flex" alignItems="center">
            {showName ? 'Śpiewanki' : 'Piosenki'}
            {meeting.songs.length ? ` (${meeting.songs.length})` : ''}
            <SyncButton sync={fetchSongs} syncing={fetchingSongs} />
          </Typography>
          {showName && (
            <Typography color="text.secondary">
              {meeting.name}
              {!meeting.isHost && ` - ${meeting.host}`}
            </Typography>
          )}
        </Stack>
        {meeting.songs.length ? (
          <MeetingSongs meeting={meeting} userInfo={showUserInfo} />
        ) : (
          <Typography color="text.disabled">Brak piosenek</Typography>
        )}
        <FormControlLabel
          control={<Switch checked={showUserInfo} onChange={(_, checked) => setShowUserInfo(checked)} />}
          label="Pokaż uczestników"
          sx={{ mt: 'auto' }}
        />
      </Stack>
    </Paper>
  );
};

export default MeetingSongsPaper;

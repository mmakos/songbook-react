import { Divider, FormControlLabel, Paper, Stack, Switch, Typography } from '@mui/material';
import SyncButton from '../components/SyncButton.tsx';
import MeetingSongs from './MeetingSongs.tsx';
import { FC, useState } from 'react';
import { IMeeting, IMeetingSong } from './meeting.types.tsx';
import useAuthAPI from '../http/useAuthAPI.ts';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { setMeetingSettings } from '../store/songbook.reducer.ts';
import RouteLink from "../components/RouteLink.tsx";

interface IMeetingSongsPaperProps {
  meeting: IMeeting;
  songsChanged: (songs: IMeetingSong[]) => void;
  showName?: boolean;
}

const MeetingSongsPaper: FC<IMeetingSongsPaperProps> = ({ meeting, songsChanged, showName }) => {
  const meetingSetting = useAppSelector((state) => state.songbookSettings.meetingSettings);
  const [fetchingSongs, setFetchingSongs] = useState(false);
  const authAPI = useAuthAPI();
  const dispatch = useAppDispatch();
  const { showUserInfo, showHiddenSongs } = meetingSetting;

  const fetchSongs = () => {
    setFetchingSongs(true);
    authAPI
      .get(`meeting/${meeting.id}/songs/`)
      .then(({ data }) => songsChanged(data.songs))
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
            <RouteLink to={`/meeting/${meeting.id}`} color="text.secondary" underline='hover'>
              {meeting.name}
              {!meeting.isHost && ` - ${meeting.host}`}
            </RouteLink>
          )}
        </Stack>
        {meeting.songs.length ? (
          <MeetingSongs
            meeting={meeting}
            userInfo={showUserInfo}
            songsChanged={songsChanged}
            showHidden={showHiddenSongs}
          />
        ) : (
          <Typography color="text.disabled">Brak piosenek</Typography>
        )}
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={showHiddenSongs}
              onChange={(_, checked) => dispatch(setMeetingSettings({ ...meetingSetting, showHiddenSongs: checked }))}
            />
          }
          label="Pokaż zaśpiewane"
          sx={{ mt: 'auto' }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={showUserInfo}
              onChange={(_, checked) => dispatch(setMeetingSettings({ ...meetingSetting, showUserInfo: checked }))}
            />
          }
          label="Pokaż uczestników"
        />
      </Stack>
    </Paper>
  );
};

export default MeetingSongsPaper;

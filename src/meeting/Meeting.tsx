import MeetingUsers from './MeetingUsers.tsx';
import { Button, FormControlLabel, IconButton, Paper, Stack, Switch, TextField, Typography } from '@mui/material';
import MeetingSongs from './MeetingSongs.tsx';
import { IMeeting } from './meeting.types.tsx';
import { useEffect, useState } from 'react';
import MeetingInfo from './MeetingInfo.tsx';
import Grid from '@mui/material/Grid2';
import useAuthAPI from '../http/useAuthAPI.ts';
import { useAppDispatch } from '../store/songbook.store.ts';
import { notifyError, notifySuccess } from '../store/songbook.reducer.ts';
import Progress from '../components/Progress.tsx';
import { useParams } from 'react-router';
import NotFound from '../subsites/NotFound.tsx';
import { Sync } from '@mui/icons-material';

const Meeting = () => {
  const [meeting, setMeeting] = useState<IMeeting | null>();
  const [showUserInfo, setShowUserInfo] = useState(true);
  const [username, setUsername] = useState('');

  const { meetingId } = useParams();
  const authAPI = useAuthAPI();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setMeeting(undefined);
    authAPI
      .get(`meeting/${meetingId}/`)
      .then(({ data }) => setMeeting(data))
      .catch(() => setMeeting(null));
  }, [meetingId]);

  if (meeting === undefined) return <Progress />;
  if (meeting === null) return <NotFound text="Spotkanie nie istnieje" />;

  const addUser = () => {
    authAPI
      .post(`meeting/${meeting.id}/add-user/`, { user: username })
      .then(() => {
        dispatch(notifySuccess(`Dodano użytkownika ${username} do spiewanek`));
        setMeeting({ ...meeting, participants: [...meeting.participants, username] });
        setUsername('');
      })
      .catch(() => dispatch(notifyError(`Nie znaleziono użytkownika o nazwie ${username}`)));
  };

  const handleUserRemoved = (username: string) => {
    setMeeting({ ...meeting, participants: meeting.participants.filter((u) => u !== username) });
  };

  const fetchUsers = () => {
    authAPI
      .get(`meeting/${meeting.id}/users/`)
      .then(({ data }) => setMeeting({ ...meeting, participants: data.participants }));
  };

  const fetchSongs = () => {
    authAPI.get(`meeting/${meeting.id}/songs/`).then(({ data }) => setMeeting({ ...meeting, songs: data.songs }));
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Paper sx={{ p: '1em' }}>
            <MeetingInfo meeting={meeting} />
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper sx={{ p: '1em', height: '100%' }}>
            <Stack spacing={1} useFlexGap height="100%">
              <Typography variant="h6" display="flex" alignItems="center">
                Uczestnicy{meeting.participants.length ? ` (${meeting.participants.length})` : ''}
                <IconButton sx={{ ml: 'auto' }} onClick={fetchUsers}>
                  <Sync />
                </IconButton>
              </Typography>
              {meeting.participants.length ? (
                <MeetingUsers meeting={meeting} userRemoved={handleUserRemoved} />
              ) : (
                <Typography color="text.disabled">Brak uczestników</Typography>
              )}
              {meeting.permissions.invite && (
                <>
                  <TextField
                    label="Nazwa użytownika"
                    size="small"
                    sx={{ mt: 'auto' }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Button variant="outlined" disabled={!username} onClick={addUser}>
                    Dodaj uczestnika
                  </Button>
                </>
              )}
            </Stack>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper sx={{ p: '1em', height: '100%' }}>
            <Stack spacing={1} useFlexGap height="100%">
              <Typography variant="h6" display="flex" alignItems="center">
                Piosenki{meeting.songs.length ? ` (${meeting.songs.length})` : ''}
                <IconButton sx={{ ml: 'auto' }} onClick={fetchSongs}>
                  <Sync />
                </IconButton>
              </Typography>
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
        </Grid>
      </Grid>
    </div>
  );
};

export default Meeting;

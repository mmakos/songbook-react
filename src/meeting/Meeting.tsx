import MeetingUsers from './MeetingUsers.tsx';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { IMeeting } from './meeting.types.tsx';
import { useEffect, useState } from 'react';
import MeetingInfo from './MeetingInfo.tsx';
import useAuthAPI from '../http/useAuthAPI.ts';
import { useAppDispatch } from '../store/songbook.store.ts';
import { notifyError, notifySuccess } from '../store/songbook.reducer.ts';
import Progress from '../components/Progress.tsx';
import { useParams } from 'react-router';
import NotFound from '../subsites/NotFound.tsx';
import SyncButton from '../components/SyncButton.tsx';
import MeetingSongsPaper from './MeetingSongsPaper.tsx';

const Meeting = () => {
  const [meeting, setMeeting] = useState<IMeeting | null>();
  const [username, setUsername] = useState('');
  const [fetchingUsers, setFetchingUsers] = useState(false);

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
    setFetchingUsers(true);
    authAPI
      .get(`meeting/${meeting.id}/users/`)
      .then(({ data }) => setMeeting({ ...meeting, participants: data.participants }))
      .finally(() => setFetchingUsers(false));
  };

  return (
    <Stack spacing={2} width="50em">
      <Paper sx={{ p: '1em' }}>
        <MeetingInfo meeting={meeting} />
      </Paper>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} flexGrow={1}>
        <Paper sx={{ p: '1em', flexGrow: 1 }}>
          <Stack spacing={1} useFlexGap height="100%">
            <Typography variant="h6" display="flex" alignItems="center">
              Uczestnicy{meeting.participants.length ? ` (${meeting.participants.length})` : ''}
              <SyncButton sync={fetchUsers} syncing={fetchingUsers} />
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
        <MeetingSongsPaper
          meeting={meeting}
          songsChanged={(songs) => setMeeting({ ...meeting, songs })}
        />
      </Stack>
    </Stack>
  );
};

export default Meeting;

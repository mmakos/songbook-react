import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { IMeetingOverview } from './meeting.types.tsx';
import { Sync } from '@mui/icons-material';
import { notifyError, notifySuccess } from '../store/songbook.reducer.ts';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store/songbook.store.ts';
import useAuthAPI from '../http/useAuthAPI.ts';
import RouteListButton from '../components/RouteListButton.tsx';
import Progress from '../components/Progress.tsx';
import { conjugate } from '../string.utils.ts';
import RouteButton from '../components/RouteButton.tsx';
import CurrentMeetingCheckbox from './CurrentMeetingCheckbox.tsx';

const MyMeetings = () => {
  const [hosted, setHosted] = useState<IMeetingOverview[]>();
  const [participated, setParticipated] = useState<IMeetingOverview[]>();
  const [confirmDelete, setConfirmDelete] = useState<IMeetingOverview>();
  const [meetingAccess, setMeetingAccess] = useState('');
  const dispatch = useAppDispatch();
  const authAPI = useAuthAPI();

  const fetchHosted = () => {
    authAPI
      .get('meeting/hosted/')
      .then(({ data }) => setHosted(data))
      .catch(() => setHosted([]));
  };

  const fetchParticipated = () => {
    authAPI
      .get('meeting/participated/')
      .then(({ data }) => setParticipated(data))
      .catch(() => setParticipated([]));
  };

  useEffect(() => {
    fetchHosted();
    fetchParticipated();
  }, []);

  const deleteMeeting = () => {
    if (!confirmDelete) return;
    authAPI
      .delete(`meeting/${confirmDelete.id}/`)
      .then(() => {
        dispatch(notifySuccess(`Pomyślnie usunięto spotkanie ${confirmDelete.name}`));
        setHosted(hosted?.filter((h) => h.id !== confirmDelete.id));
      })
      .catch(() => dispatch(notifyError('Nie udało się usunąć spotkania')));
    setConfirmDelete(undefined);
  };

  return (
    <Stack spacing={2}>
      {!hosted && !participated && <Progress />}
      <Paper sx={{ p: '1em' }}>
        <Stack spacing={1}>
          <Typography variant="h6" display="flex" alignItems="center">
            Twoje śpiewanki
            <IconButton sx={{ ml: 'auto' }} onClick={fetchHosted}>
              <Sync />
            </IconButton>
          </Typography>
          {hosted?.length ? (
            <List disablePadding>
              {hosted.map((meeting) => (
                <ListItem disablePadding secondaryAction={<CurrentMeetingCheckbox meetingId={meeting.id} />}>
                  <RouteListButton to={`/meeting/${meeting.id}`}>
                    <ListItemText
                      primary={meeting.name}
                      secondary={`${meeting.songs} ${conjugate(meeting.songs, 'piosen', 'ka', 'ki', 'ek')}, ${meeting.participants} ${conjugate(meeting.participants, 'uczestnik', '', 'ów', 'ów')}`}
                    />
                  </RouteListButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">Nie masz żadnych śpiewanek</Typography>
          )}
          <RouteButton to="/add/meeting">Utwórz śpiewanki</RouteButton>
        </Stack>
      </Paper>
      <Paper sx={{ p: '1em' }}>
        <Stack spacing={1} useFlexGap>
          <Typography variant="h6" display="flex" alignItems="center">
            Śpiewanki, w których uczestniczysz
            <IconButton sx={{ ml: 'auto' }} onClick={fetchParticipated}>
              <Sync />
            </IconButton>
          </Typography>
          {participated?.length ? (
            <List>
              {participated.map((meeting) => (
                <ListItem disablePadding secondaryAction={<CurrentMeetingCheckbox meetingId={meeting.id} />}>
                  <RouteListButton to={`/meeting/${meeting.id}`}>
                    <ListItemText
                      primary={`${meeting.name} - ${meeting.host}`}
                      secondary={`${meeting.songs} piosenek, ${meeting.participants} uczestników`}
                    />
                  </RouteListButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">Nie uczestniczysz w żadnych śpiewankach</Typography>
          )}
          <TextField
            label="Kod dostępu"
            size="small"
            sx={{ mt: '0.5em' }}
            value={meetingAccess}
            onChange={(e) => setMeetingAccess(e.target.value)}
          />
          <RouteButton to={`/join/meeting/${meetingAccess}`} disabled={!meetingAccess}>
            Dołącz do śpiewanek
          </RouteButton>
        </Stack>
      </Paper>
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(undefined)}>
        <DialogTitle>Usuwanie śpiewanek</DialogTitle>
        <DialogContent>
          Czy na pewno chcesz usunąć śpiewanki „{confirmDelete?.name}”? Ta czynność jest nieodwracalna. Wszystkie dane
          spotkania wraz z listą piosenek zostaną usunięte.
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setConfirmDelete(undefined)}>
            Anuluj
          </Button>
          <Button variant="outlined" onClick={deleteMeeting}>
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default MyMeetings;

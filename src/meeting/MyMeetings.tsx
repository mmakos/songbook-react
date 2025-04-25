import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { IMeetingOverview } from './meeting.types.tsx';
import { notifyError, notifySuccess } from '../store/songbook.reducer.ts';
import { FormEvent, useEffect, useState } from 'react';
import { useAppDispatch } from '../store/songbook.store.ts';
import useAuthAPI from '../http/useAuthAPI.ts';
import Progress from '../components/Progress.tsx';
import RouteButton from '../components/RouteButton.tsx';
import SyncButton from '../components/SyncButton.tsx';
import Grid from '@mui/material/Grid2';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { api } from '../http/api.ts';
import MeetingList from './MeetingList.tsx';

const MyMeetings = () => {
  const [hosted, setHosted] = useState<IMeetingOverview[]>();
  const [fetchingHosted, setFetchingHosted] = useState(false);
  const [participated, setParticipated] = useState<IMeetingOverview[]>();
  const [fetchingParticipated, setFetchingParticipated] = useState(false);
  const [searched, setSearched] = useState<IMeetingOverview[]>();
  const [fetchingSearched, setFetchingSearched] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<IMeetingOverview>();
  const [meetingAccess, setMeetingAccess] = useState('');
  const [search, setSearch] = useState('');

  const dispatch = useAppDispatch();
  const authAPI = useAuthAPI();
  const navigate = useNavigate();

  const fetchHosted = () => {
    setFetchingHosted(true);
    authAPI
      .get('meeting/hosted/')
      .then(({ data }) => setHosted(data))
      .catch(() => setHosted([]))
      .finally(() => setFetchingHosted(false));
  };

  const fetchParticipated = () => {
    setFetchingParticipated(true);
    authAPI
      .get('meeting/participated/')
      .then(({ data }) => setParticipated(data))
      .catch(() => setParticipated([]))
      .finally(() => setFetchingParticipated(false));
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

  const handleSubmitMeetingCode = (event: FormEvent) => {
    event.preventDefault();
    if (meetingAccess) {
      navigate(`/join/meeting/${meetingAccess}`);
    }
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    if (fetchingSearched) return;
    setFetchingSearched(true);
    api
      .get('meeting/search/', { params: { q: search } })
      .then(({ data }) => setSearched(data))
      .finally(() => setFetchingSearched(false));
  };

  return (
    <>
      {!hosted && !participated && <Progress />}
      <Grid container spacing={2} flexGrow={1}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={{ p: '1em', height: '100%' }}>
            <Stack spacing={1} useFlexGap height="100%">
              <Typography variant="h6" display="flex" alignItems="start">
                Twoje śpiewanki
                <SyncButton sync={fetchHosted} syncing={fetchingHosted} />
              </Typography>
              {hosted?.length ? (
                <MeetingList meetings={hosted} />
              ) : (
                <Typography color="text.secondary">Nie masz żadnych śpiewanek</Typography>
              )}
              <RouteButton to="/add/meeting" sx={{ mt: 'auto' }}>
                Utwórz śpiewanki
              </RouteButton>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper sx={{ p: '1em', height: '100%' }}>
            <Stack spacing={1} component="form" useFlexGap height="100%" onSubmit={handleSubmitMeetingCode}>
              <Typography variant="h6" display="flex" alignItems="start">
                <span style={{ marginRight: '1em' }}>Śpiewanki, w których uczestniczysz</span>
                <SyncButton sync={fetchParticipated} syncing={fetchingParticipated} />
              </Typography>
              {participated?.length ? (
                <MeetingList meetings={participated} showHost />
              ) : (
                <Typography color="text.secondary">Nie uczestniczysz w żadnych śpiewankach</Typography>
              )}
              <TextField
                label="Kod dostępu"
                size="small"
                sx={{ mt: 'auto' }}
                value={meetingAccess}
                onChange={(e) => setMeetingAccess(e.target.value)}
              />
              <Button type="submit" disabled={!meetingAccess}>
                Dołącz do śpiewanek
              </Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: '1em', height: '100%' }}>
            <Stack spacing={2} component="form" onSubmit={handleSearch}>
              <Typography variant="h6">Wyszukaj śpiewanki</Typography>
              <TextField
                placeholder="Szukaj…"
                value={search}
                type="search"
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {fetchingSearched ? (
                          <CircularProgress size={25} />
                        ) : (
                          <IconButton type="submit">
                            <Search />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {searched?.length ? (
                <MeetingList meetings={searched} showHost />
              ) : (
                <Typography color="text.secondary">Nie znaleziono żadnych śpiewanek</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
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
    </>
  );
};

export default MyMeetings;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { editText, IMeeting, sortText, visibilityText } from './meeting.types.tsx';
import { Delete, Edit, Link, Login, Logout, Visibility } from '@mui/icons-material';
import { notifyError, notifySuccess } from '../store/songbook.reducer.ts';
import { useAppDispatch } from '../store/songbook.store.ts';
import RouteIconButton from '../components/RouteIconButton.tsx';
import useAuthAPI from '../http/useAuthAPI.ts';
import useCanEdit from '../store/useCanEdit.hook.ts';
import CurrentMeetingCheckbox from './CurrentMeetingCheckbox.tsx';

const MeetingInfo: FC<{ meeting: IMeeting }> = ({ meeting }) => {
  const [accessVisible, setAccessVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { canEdit } = useCanEdit();
  const dispatch = useAppDispatch();
  const authAPI = useAuthAPI();

  const copyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.protocol}//${window.location.host}/join/meeting/${meeting.access}`)
      .then(() => dispatch(notifySuccess('Skopiowano link do dołączania do schowka')));
  };

  const copyAccess = () => {
    navigator.clipboard
      .writeText(meeting.access!)
      .then(() => dispatch(notifySuccess('Skopiowano kod dostępu do schowka')));
  };

  const deleteMeeting = () => {
    setConfirmDelete(false);
    authAPI
      .delete(`meeting/${meeting.id}/`)
      .then(() => dispatch(notifySuccess('Pomyślnie usunięto spotkanie')))
      .catch(() => dispatch(notifyError('Nie udało się usunąć spotkania')));
  };

  const inviteWithCode = meeting.permissions.invite && meeting?.access;

  return (
    <Stack spacing={2}>
      <Typography variant="h5" display="flex" alignItems="center">
        Śpiewanki „{meeting.name}”
        <CurrentMeetingCheckbox meetingId={meeting.id} sx={{ ml: 'auto' }} />
        {!meeting.inMeeting && canEdit && (
          <IconButton>
            <Login />
          </IconButton>
        )}
        {meeting.inMeeting && !meeting.isHost && (
          <IconButton>
            <Logout />
          </IconButton>
        )}
        {meeting.permissions.edit && (
          <>
            <RouteIconButton to={`/edit/meeting/${meeting.id}`}>
              <Edit />
            </RouteIconButton>
            <IconButton onClick={() => setConfirmDelete(true)}>
              <Delete />
            </IconButton>
          </>
        )}
      </Typography>
      <TextField label="Host" value={meeting.host} variant="standard" slotProps={{ input: { readOnly: true } }} />
      <TextField
        label="Widoczność"
        value={visibilityText[meeting.visibility].text}
        helperText={visibilityText[meeting.visibility].helper}
        variant="standard"
        slotProps={{ input: { readOnly: true } }}
      />
      <TextField
        label="Edycja"
        value={editText[meeting.edit].text}
        helperText={editText[meeting.edit].helper}
        variant="standard"
        slotProps={{ input: { readOnly: true } }}
      />
      <TextField
        label="Sortowanie"
        value={sortText[meeting.sort].text}
        helperText={sortText[meeting.sort].helper}
        variant="standard"
        slotProps={{ input: { readOnly: true } }}
      />
      {inviteWithCode && (
        <TextField
          label="Kod dostępu"
          value={meeting.access}
          variant="standard"
          type={accessVisible ? 'text' : 'password'}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={() => setAccessVisible(!accessVisible)}>
                    <Visibility />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={copyAccess}>
                    <Link />
                  </IconButton>
                </InputAdornment>
              ),
              readOnly: true,
            },
          }}
        />
      )}
      {(inviteWithCode || meeting.visibility === 'public') && (
        <TextField
          label="Link do dołączania"
          value={`${window.location.protocol}//${window.location.host}/join/meeting/${!inviteWithCode ? 'id/' + meeting.id : meeting.access}`}
          variant="standard"
          type={accessVisible || !inviteWithCode ? 'text' : 'password'}
          slotProps={{
            input: {
              startAdornment: inviteWithCode ? (
                <InputAdornment position="start">
                  <IconButton onClick={() => setAccessVisible(!accessVisible)}>
                    <Visibility />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={copyLink}>
                    <Link />
                  </IconButton>
                </InputAdornment>
              ),
              readOnly: true,
            },
          }}
        />
      )}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Usuwanie śpiewanek</DialogTitle>
        <DialogContent>
          Czy na pewno chcesz usunąć śpiewanki? Ta czynność jest nieodwracalna. Wszystkie dane spotkania wraz z listą
          piosenek zostaną usunięte.
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setConfirmDelete(false)}>
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

export default MeetingInfo;

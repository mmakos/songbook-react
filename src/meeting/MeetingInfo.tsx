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
import { Delete, Edit, Link, Login, Logout, Visibility, VisibilityOff } from '@mui/icons-material';
import { notifyError, notifySuccess, setCurrentMeeting } from '../store/songbook.reducer.ts';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import RouteIconButton from '../components/RouteIconButton.tsx';
import useAuthAPI from '../http/useAuthAPI.ts';
import useCanEdit from '../store/useCanEdit.hook.ts';
import CurrentMeetingCheckbox from './CurrentMeetingCheckbox.tsx';
import BasicTooltip from '../components/BasicTooltip.tsx';
import { useNavigate } from 'react-router';

const MeetingInfo: FC<{ meeting: IMeeting }> = ({ meeting }) => {
  const [accessVisible, setAccessVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const { canEdit } = useCanEdit();
  const currentMeeting = useAppSelector((state) => state.meeting.id);
  const dispatch = useAppDispatch();
  const authAPI = useAuthAPI();
  const navigate = useNavigate();

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
      .then(() => {
        if (currentMeeting === meeting.id) {
          dispatch(setCurrentMeeting(undefined));
        }
        navigate('/meetings');
        dispatch(notifySuccess('Pomyślnie usunięto spotkanie'));
      })
      .catch(() => dispatch(notifyError('Nie udało się usunąć spotkania')));
  };

  const leaveMeeting = () => {
    setConfirmLeave(false);
    authAPI
      .post(`meeting/${meeting.id}/leave/`)
      .then(() => {
        if (currentMeeting === meeting.id && meeting.visibility !== 'public') {
          dispatch(setCurrentMeeting(undefined));
        }
        navigate('/meetings');
        dispatch(notifySuccess('Pomyślnie opuszczono spotkanie'));
      })
      .catch(() => dispatch(notifyError('Nie udało się opuścić spotkania')));
  };

  const inviteWithCode = meeting.permissions.invite && meeting?.access && meeting.visibility === 'code';

  return (
    <Stack spacing={2}>
      <Typography variant="h5" display="flex" alignItems="center">
        Śpiewanki „{meeting.name}”
        <BasicTooltip title="Obecne śpiewanki" span style={{ marginLeft: 'auto' }}>
          <CurrentMeetingCheckbox meetingId={meeting.id} />
        </BasicTooltip>
        {!meeting.inMeeting && canEdit && (
          <BasicTooltip title="Dołącz do śpiewanek">
            <RouteIconButton to={`/join/meeting/id/${meeting.id}`}>
              <Login />
            </RouteIconButton>
          </BasicTooltip>
        )}
        {meeting.inMeeting && !meeting.isHost && (
          <BasicTooltip title="Opuść śpiewanki">
            <IconButton onClick={() => setConfirmLeave(true)}>
              <Logout />
            </IconButton>
          </BasicTooltip>
        )}
        {meeting.permissions.edit && (
          <>
            <BasicTooltip title="Edytuj śpiewanki" span>
              <RouteIconButton to={`/edit/meeting/${meeting.id}`}>
                <Edit />
              </RouteIconButton>
            </BasicTooltip>
            <BasicTooltip title="Usuń śpiewanki">
              <IconButton onClick={() => setConfirmDelete(true)}>
                <Delete />
              </IconButton>
            </BasicTooltip>
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
                  <BasicTooltip title={`${accessVisible ? 'Ukryj' : 'Pokaż'} kod dostępu`}>
                    <IconButton onClick={() => setAccessVisible(!accessVisible)}>
                      {accessVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </BasicTooltip>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <BasicTooltip title="Skopiuj kod dostępu">
                    <IconButton onClick={copyAccess}>
                      <Link />
                    </IconButton>
                  </BasicTooltip>
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
                  <BasicTooltip title={`${accessVisible ? 'Ukryj' : 'Pokaż'} link do dołączania`}>
                    <IconButton onClick={() => setAccessVisible(!accessVisible)}>
                      {accessVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </BasicTooltip>
                </InputAdornment>
              ) : undefined,
              endAdornment: (
                <InputAdornment position="end">
                  <BasicTooltip title="Skopiuj link do dołączania">
                    <IconButton onClick={copyLink}>
                      <Link />
                    </IconButton>
                  </BasicTooltip>
                </InputAdornment>
              ),
              readOnly: true,
            },
          }}
        />
      )}
      <Dialog
        open={confirmDelete || confirmLeave}
        onClose={() => {
          setConfirmDelete(false);
          setConfirmLeave(false);
        }}
      >
        <DialogTitle>{confirmDelete ? 'Usuwanie' : 'Opuszczanie'} śpiewanek</DialogTitle>
        <DialogContent>
          Czy na pewno chcesz {confirmDelete ? 'usunąć' : 'opuścić'} śpiewanki?
          {confirmDelete
            ? 'Ta czynność jest nieodwracalna. Wszystkie dane spotkania wraz z listą piosenek zostaną usunięte.'
            : ''}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setConfirmDelete(false);
              setConfirmLeave(false);
            }}
          >
            Anuluj
          </Button>
          <Button variant="outlined" onClick={confirmDelete ? deleteMeeting : leaveMeeting}>
            {confirmDelete ? 'Usuń' : 'Opuść'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default MeetingInfo;

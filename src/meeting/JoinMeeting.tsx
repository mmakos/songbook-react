import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import useAuthAPI from '../http/useAuthAPI.ts';
import { useAppDispatch } from '../store/songbook.store.ts';
import { notifySuccess, setCurrentMeeting } from '../store/songbook.reducer.ts';
import { AxiosResponse } from 'axios';
import { Stack, Typography } from '@mui/material';

const JoinMeeting = () => {
  const [invalid, setInvalid] = useState(false);
  const { accessCode, meetingId } = useParams();
  const authAPI = useAuthAPI();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!accessCode && !meetingId) {
      setInvalid(true);
      return;
    }
    authAPI
      .post('meeting/join/', { accessCode: accessCode, id: meetingId })
      .then(({ data }: AxiosResponse<{ id: number; name: string }>) => {
        dispatch(notifySuccess(`Dołączono do śpiewanek ${data.name}`));
        dispatch(setCurrentMeeting(data.id));
        navigate(`/meeting/${data.id}`);
      })
      .catch(() => setInvalid(true));
  }, [accessCode]);

  if (invalid)
    return (
      <Stack spacing={1} alignItems="center">
        <Typography variant="h4">Nie udało się dołączyć do spotkania.</Typography>
        {accessCode && <Typography>Upewnij się, że dostałeś prawidłowy kod/link dostępowy.</Typography>}
        {meetingId && <Typography>Upewnij się, że śpiewanki do których chcesz dołączyć, są publiczne.</Typography>}
      </Stack>
    );
};

export default JoinMeeting;

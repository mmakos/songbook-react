import { useAppSelector } from '../store/songbook.store.ts';
import { Navigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import MyMeetings from './MyMeetings.tsx';

const CurrentMeeting = () => {
  const meetingId = useAppSelector((state) => state.meeting.id);

  if (meetingId) return <Navigate to={`/meeting/${meetingId}`} />;

  return (
    <Stack spacing={2}>
      <Stack>
        <Typography>Nie ustawiłeś żadnych śpiewanek jako obecne.</Typography>
        <Typography variant="caption" color="text.secondary">
          Wciśnij flagę przy wybranych śpiewankach, aby ustawić jako obecne.
        </Typography>
      </Stack>
      <MyMeetings />
    </Stack>
  );
};

export default CurrentMeeting;

import { useAppSelector } from '../store/songbook.store.ts';
import { Navigate } from 'react-router-dom';
import { Typography } from '@mui/material';

const CurrentMeeting = () => {
  const meetingId = useAppSelector((state) => state.meeting.id);

  if (meetingId) return <Navigate to={`/meeting/${meetingId}`} />;

  return <Typography>Nie ustawiłeś żadnych śpiewanek jako obecne.</Typography>;
};

export default CurrentMeeting;

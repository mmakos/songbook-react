import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { IMeetingInfo } from './meeting.types.tsx';
import Progress from '../components/Progress.tsx';
import MeetingEditInfo from './MeetingEditInfo.tsx';
import useAuthAPI from '../http/useAuthAPI.ts';
import { AxiosResponse } from 'axios';
import { useAppDispatch } from '../store/songbook.store.ts';
import { notifyError } from '../store/songbook.reducer.ts';

const EditMeeting = () => {
  const { meetingId } = useParams();
  const { authAPI, accessToken } = useAuthAPI();
  const dispatch = useAppDispatch();
  const [meetingInfo, setMeetingInfo] = useState<IMeetingInfo>();

  useEffect(() => {
    if (accessToken) {
      authAPI
          .get(`meeting/${meetingId}/`)
          .then((response: AxiosResponse<IMeetingInfo>) => setMeetingInfo(response.data))
          .catch(() => dispatch(notifyError('Błąd podczas pobierania informacji o spotkaniu')));
    }
  }, [meetingId, accessToken]);

  if (!meetingInfo) return <Progress />;

  return <MeetingEditInfo info={meetingInfo} />;
};

export default EditMeeting;

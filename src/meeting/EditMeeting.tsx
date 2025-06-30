import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { IMeetingInfo } from './meeting.types.tsx';
import Progress from '../components/Progress.tsx';
import MeetingEditInfo from './MeetingEditInfo.tsx';
import useAuthAPI from '../http/useAuthAPI.ts';
import { AxiosResponse } from 'axios';
import { useAppDispatch } from '../store/songbook.store.ts';
import { notifyError } from '../store/songbook.reducer.ts';
import BasicHelmet from '../subsites/BasicHelmet.tsx';

const EditMeeting = () => {
  const { meetingId } = useParams();
  const authAPI = useAuthAPI();
  const dispatch = useAppDispatch();
  const [meetingInfo, setMeetingInfo] = useState<IMeetingInfo>();

  useEffect(() => {
    authAPI
      .get(`meeting/${meetingId}/`)
      .then((response: AxiosResponse<IMeetingInfo>) => setMeetingInfo(response.data))
      .catch(() => dispatch(notifyError('Błąd podczas pobierania informacji o spotkaniu')));
  }, [meetingId]);

  if (!meetingInfo) return <Progress />;

  return (
    <>
      <BasicHelmet title={`Edycja śpiewanek „${meetingInfo.name}”`} />
      <MeetingEditInfo info={meetingInfo} />
    </>
  );
};

export default EditMeeting;

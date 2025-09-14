import { useAppDispatch, useAppSelector } from './songbook.store.ts';
import { useEffect } from 'react';
import useAuthAPI from '../http/useAuthAPI.ts';
import { setMeeting } from './songbook.reducer.ts';
import { sortSongs } from '../meeting/meeting.sort.ts';

const useMeeting = () => {
  const meetingId = useAppSelector((state) => state.meeting.id);
  const meeting = useAppSelector((state) => state.meeting.meeting);
  const authAPI = useAuthAPI();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (meetingId && meetingId === meeting?.id) return;
    dispatch(setMeeting(undefined));

    if (meetingId) {
      authAPI
        .get(`meeting/${meetingId}/`)
        .then(({ data }) => dispatch(setMeeting({ ...data, songs: sortSongs(data.songs, data.sort) })));
    }
  }, [meetingId]);

  return meeting;
};

export default useMeeting;

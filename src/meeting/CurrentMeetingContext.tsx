import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { IMeeting } from './meeting.types.tsx';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { useAuthAPI } from '../http/AuthApiContext.tsx';
import { setMeeting } from '../store/songbook.reducer.ts';
import { sortSongs } from './meeting.sort.ts';

export interface ICurrentMeetingContextProps {
  meeting?: IMeeting;
}

const CurrentMeetingContextComponent = (): ICurrentMeetingContextProps => {
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
        .then(({ data }) => dispatch(setMeeting({ ...data, songs: sortSongs(data.songs, data.sort) })))
        .catch(() => {});
    }
  }, [meetingId]);

  return { meeting };
};

export const CurrentMeetingContext = createContext({} as ICurrentMeetingContextProps);

export const CurrentMeetingContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <CurrentMeetingContext.Provider value={CurrentMeetingContextComponent()}>{children}</CurrentMeetingContext.Provider>
  );
};

export const useCurrentMeeting = () => useContext(CurrentMeetingContext);

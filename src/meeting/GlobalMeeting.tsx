import MeetingSongsPaper from './MeetingSongsPaper.tsx';
import useMeeting from '../store/useMeeting.ts';
import { useAppDispatch } from '../store/songbook.store.ts';
import { setMeeting } from '../store/songbook.reducer.ts';

const GlobalMeeting = () => {
  const meeting = useMeeting();
  const dispatch = useAppDispatch();

  return (
    meeting && (
      <MeetingSongsPaper
        meeting={meeting}
        songsChanged={(songs) => dispatch(setMeeting({ ...meeting, songs }))}
        showName
      />
    )
  );
};

export default GlobalMeeting;

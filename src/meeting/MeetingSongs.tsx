import { FC, useMemo } from 'react';
import { IMeeting, IMeetingSong } from './meeting.types.tsx';
import MeetingSongsList from './MeetingSongsList.tsx';
import { Divider } from '@mui/material';

export interface IMeetingSongsProps {
  meeting: IMeeting;
  songsChanged: (meetingSongs: IMeetingSong[]) => void;
  userInfo?: boolean;
  showHidden?: boolean;
  currentSong?: string;
}

const MeetingSongs: FC<IMeetingSongsProps> = (props) => {
  const meeting = props.meeting;

  const [songs, hiddenSongs] = useMemo(() => {
    const activeSongs: IMeetingSong[] = [];
    const hiddenSongs: IMeetingSong[] = [];
    meeting.songs.forEach((s) => (s.hidden ? hiddenSongs : activeSongs).push(s));
    return [activeSongs, hiddenSongs];
  }, [meeting.songs]);

  return (
    <>
      <MeetingSongsList {...props} songs={songs} />
      {props.showHidden && !!hiddenSongs.length && (
        <>
          <Divider />
          <MeetingSongsList {...props} songs={hiddenSongs} />
        </>
      )}
    </>
  );
};

export default MeetingSongs;

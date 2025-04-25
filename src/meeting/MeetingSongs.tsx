import { FC, useMemo } from 'react';
import { IMeeting, IMeetingSong } from './meeting.types.tsx';
import MeetingSongsList from './MeetingSongsList.tsx';
import { Divider } from '@mui/material';
import { sortSongs } from './meeting.sort.ts';

export interface IMeetingSongsProps {
  meeting: IMeeting;
  songsChanged: (meetingSongs: IMeetingSong[]) => void;
  userInfo?: boolean;
  showHidden?: boolean;
}

const MeetingSongs: FC<IMeetingSongsProps> = (props) => {
  const meeting = props.meeting;

  const [songs, hiddenSongs] = useMemo(() => {
    const sortedSongs = sortSongs(meeting.songs, meeting.sort);

    const songs: IMeetingSong[] = [];
    const hiddenSongs: IMeetingSong[] = [];
    sortedSongs.forEach((s) => (s.hidden ? hiddenSongs : songs).push(s));
    return [songs, hiddenSongs];
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

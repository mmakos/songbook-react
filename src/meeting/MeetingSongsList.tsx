import { TransitionGroup } from 'react-transition-group';
import { Collapse, IconButton, List, ListItem, ListItemText, Stack, useTheme } from '@mui/material';
import { Clear, DragIndicator } from '@mui/icons-material';
import RouteLink from '../components/RouteLink.tsx';
import VoteButton from './VoteButton.tsx';
import { FC } from 'react';
import { IMeetingSong } from './meeting.types.tsx';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { notifyError } from '../store/songbook.reducer.ts';
import useAuthAPI from '../http/useAuthAPI.ts';
import { IMeetingSongsProps } from './MeetingSongs.tsx';

const MeetingSongsList: FC<IMeetingSongsProps & { songs: IMeetingSong[] }> = ({
  meeting,
  songs,
  userInfo,
  songsChanged,
}) => {
  const user = useAppSelector((state) => state.user);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { authAPI } = useAuthAPI();

  const handleRemoveSong = (songSlug: string) => {
    authAPI
      .delete(`meeting/${meeting.id}/song/${songSlug}/`)
      .then(() => songsChanged(meeting.songs.filter((s) => s.slug !== songSlug)))
      .catch(() => dispatch(notifyError('Błąd podczas usuwania piosenki ze spotkania')));
  };

  const handleSongVoted = (songSlug: string, vote: boolean) => {
    songsChanged(
      meeting.songs.map((s) =>
        s.slug === songSlug ? { ...s, voted: vote, votes: (s.votes ?? 0) + (vote ? 1 : -1) } : s
      )
    );
  };

  return (
    <List dense disablePadding>
      <TransitionGroup>
        {songs.map((song) => (
          <Collapse key={song.slug}>
            <ListItem disableGutters disablePadding>
              {meeting.permissions.reorder && meeting.sort === 'custom' && (
                <DragIndicator sx={{ cursor: 'move', mr: '0.3em' }} />
              )}
              <ListItemText
                primary={
                  <RouteLink
                    to={`/song/${song.slug}`}
                    underline="hover"
                    color="text.primary"
                    sx={{ textDecoration: '' }}
                  >
                    {song.hidden ? <del>{song.title}</del> : song.title}
                  </RouteLink>
                }
                slotProps={{
                  secondary: {
                    fontSize: theme.typography.caption.fontSize,
                  },
                }}
                secondary={userInfo ? `${song.user} (${new Date(song.time * 1000).toLocaleTimeString()})` : undefined}
              />
              <Stack direction="row" alignItems="center" ml="1em">
                {meeting.permissions.vote && meeting.sort === 'votes' && (
                  <VoteButton song={song} meetingId={meeting.id} handleVoted={(v) => handleSongVoted(song.slug, v)} />
                )}
                {meeting.permissions.songs &&
                  (meeting.permissions.deleteSongs || (user && user.username === song.user && !song.hidden)) && (
                    <IconButton edge="end" size="small" onClick={() => handleRemoveSong(song.slug)}>
                      <Clear fontSize="small" />
                    </IconButton>
                  )}
              </Stack>
            </ListItem>
          </Collapse>
        ))}
      </TransitionGroup>
    </List>
  );
};

export default MeetingSongsList;

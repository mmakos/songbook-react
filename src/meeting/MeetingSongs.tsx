import { FC } from 'react';
import { IconButton, List, ListItem, ListItemText, Stack, useTheme } from '@mui/material';
import { Clear, DragIndicator } from '@mui/icons-material';
import RouteLink from '../components/RouteLink.tsx';
import { IMeeting } from './meeting.types.tsx';
import { useAppSelector } from '../store/songbook.store.ts';
import VoteButton from './VoteButton.tsx';

const MeetingSongs: FC<{ meeting: IMeeting; userInfo?: boolean }> = ({ meeting, userInfo }) => {
  const user = useAppSelector((state) => state.user);
  const theme = useTheme();

  return (
    <List dense disablePadding>
      {meeting.songs.map((song) => (
        <ListItem key={song.slug} disableGutters disablePadding>
          {meeting.permissions.reorder && meeting.sort === 'custom' && (
            <DragIndicator sx={{ cursor: 'move', mr: '0.3em' }} />
          )}
          <ListItemText
            primary={
              <RouteLink to={`/song/${song.slug}`} underline="hover" color="text.primary">
                {song.title}
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
            {meeting.permissions.vote && meeting.sort === 'votes' && <VoteButton song={song} />}
            {meeting.permissions.songs && (meeting.permissions.deleteSongs || (user && user.username === song.user)) && (
              <IconButton edge="end" size="small">
                <Clear fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </ListItem>
      ))}
    </List>
  );
};

export default MeetingSongs;

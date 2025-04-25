import { IconButton, List, ListItem, ListItemText } from '@mui/material';
import { FC } from 'react';
import { Clear } from '@mui/icons-material';
import { IMeeting } from './meeting.types.tsx';
import useAuthAPI from '../http/useAuthAPI.ts';
import { useAppDispatch } from '../store/songbook.store.ts';
import { notifyError, notifySuccess } from '../store/songbook.reducer.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';

const MeetingUsers: FC<{ meeting: IMeeting; userRemoved: (username: string) => void }> = ({ meeting, userRemoved }) => {
  const { authAPI } = useAuthAPI();
  const dispatch = useAppDispatch();

  const removeUser = (username: string) => {
    authAPI
      .post(`meeting/${meeting.id}/remove-user/`, { user: username })
      .then(() => {
        dispatch(notifySuccess(`Pomyślnie usunięto użytkownika ${username} ze śpiewanek`));
        userRemoved(username);
      })
      .catch(() => dispatch(notifyError(`Błąd podczas usuwania użytkownika ${username} ze śpiewanek`)));
  };

  return (
    <List dense disablePadding>
      {meeting.participants.map((user) => (
        <ListItem key={user} disableGutters disablePadding>
          <ListItemText primary={user} />
          {meeting.permissions.deleteUsers && user !== meeting.host && (
            <BasicTooltip title={`Usuń użytkownika ${user}`}>
              <IconButton edge="end" size="small" onClick={() => removeUser(user)}>
                <Clear fontSize="small" />
              </IconButton>
            </BasicTooltip>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default MeetingUsers;

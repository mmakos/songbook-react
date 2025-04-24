import { List, ListItem, ListItemText } from '@mui/material';
import BasicTooltip from '../components/BasicTooltip.tsx';
import CurrentMeetingCheckbox from './CurrentMeetingCheckbox.tsx';
import RouteListButton from '../components/RouteListButton.tsx';
import { conjugate } from '../string.utils.ts';
import { FC } from 'react';
import { IMeetingOverview } from './meeting.types.tsx';

interface IMeetingListProps {
  meetings: IMeetingOverview[];
  showHost?: boolean;
}

const MeetingList: FC<IMeetingListProps> = ({ meetings, showHost }) => {
  return (
    <List disablePadding>
      {meetings.map((meeting) => (
        <ListItem
          key={meeting.id}
          disablePadding
          secondaryAction={
            <BasicTooltip title="Obecne śpiewanki" span>
              <CurrentMeetingCheckbox meetingId={meeting.id} />
            </BasicTooltip>
          }
        >
          <RouteListButton to={`/meeting/${meeting.id}`}>
            <ListItemText
              primary={showHost ? `${meeting.name} - ${meeting.host}` : meeting.name}
              secondary={`${meeting.songs} ${conjugate(meeting.songs, 'piosen', 'ka', 'ki', 'ek')}, ${meeting.participants} ${conjugate(meeting.participants, 'uczestnik', '', 'ów', 'ów')}`}
            />
          </RouteListButton>
        </ListItem>
      ))}
    </List>
  );
};

export default MeetingList;

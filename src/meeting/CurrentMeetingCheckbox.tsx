import { Checkbox, CheckboxProps } from '@mui/material';
import { Flag, OutlinedFlag } from '@mui/icons-material';
import { setCurrentMeeting } from '../store/songbook.reducer.ts';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import { FC } from 'react';

const CurrentMeetingCheckbox: FC<{ meetingId: number } & CheckboxProps> = ({ meetingId, ...props }) => {
  const currentMeeting = useAppSelector((state) => state.meeting.id);
  const dispatch = useAppDispatch();

  console.log(currentMeeting)

  return (
    <Checkbox
      {...props}
      icon={<OutlinedFlag />}
      checkedIcon={<Flag />}
      checked={meetingId === currentMeeting}
      onChange={(_, checked) => dispatch(setCurrentMeeting(checked ? meetingId : undefined))}
    />
  );
};

export default CurrentMeetingCheckbox;

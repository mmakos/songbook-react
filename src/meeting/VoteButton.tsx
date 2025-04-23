import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { FC } from 'react';
import { IMeetingSong } from './meeting.types.tsx';
import { Badge, BadgeProps, Checkbox, styled } from '@mui/material';

const StyledBadge = styled(Badge)<BadgeProps>({
  '& .MuiBadge-badge': {
    minWidth: '1.3em',
    height: '1.3em',
    padding: '0 0.3em',
  },
});

const VoteIcon: FC<{ votes?: number; checked?: boolean }> = ({ votes, checked }) => {
  return (
    <StyledBadge badgeContent={votes} color="primary" anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
      {checked ? <ThumbUp fontSize="small" /> : <ThumbUpOutlined fontSize="small" />}
    </StyledBadge>
  );
};

const VoteButton: FC<{ song: IMeetingSong }> = ({ song }) => {
  return (
    <Checkbox
      sx={{ p: '5px' }}
      size="small"
      icon={<VoteIcon votes={song.votes} />}
      checkedIcon={<VoteIcon votes={song.votes} checked />}
      checked={!!song.vote}
    />
  );
};

export default VoteButton;

import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { FC, useState } from 'react';
import { IMeetingSong } from './meeting.types.tsx';
import { Badge, BadgeProps, Checkbox, styled } from '@mui/material';
import useAuthAPI from '../http/useAuthAPI.ts';

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

interface IVoteButtonProps {
  meetingId: number;
  song: IMeetingSong;
  handleVoted: (vote: boolean) => void;
}

const VoteButton: FC<IVoteButtonProps> = ({ meetingId, song, handleVoted }) => {
  const [voting, setVoting] = useState(false);
  const { authAPI } = useAuthAPI();

  const handleVote = (vote: boolean) => {
    setVoting(true);
    (vote ? authAPI.post : authAPI.delete)(`meeting/${meetingId}/vote/${song.slug}/`)
      .then(() => handleVoted(vote))
      .finally(() => setVoting(false));
  };

  return (
    <Checkbox
      sx={{ p: '5px' }}
      size="small"
      icon={<VoteIcon votes={song.votes} />}
      checkedIcon={<VoteIcon votes={song.votes} checked />}
      checked={!!song.voted}
      onChange={(_, checked) => handleVote(checked)}
      disabled={voting}
    />
  );
};

export default VoteButton;

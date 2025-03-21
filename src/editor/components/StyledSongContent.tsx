import { styled } from '@mui/material';

const StyledSongContent = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  outline: '1px solid white',
  outlineWidth: 1,
  outlineColor: theme.palette.action.disabled,
  width: '100%',
  height: '100%',
  ':hover': {
    outlineWidth: 2,
    outlineColor: theme.palette.text.primary,
  },
}));

export default StyledSongContent;

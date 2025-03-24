import { styled } from '@mui/material';

export const MajorGroup = styled('g', {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => {
  const palette = selected ? theme.palette.secondary : theme.palette.primary;
  return {
    fill: palette.main,
    cursor: 'pointer',
    transition: theme.transitions.create('fill'),
    ':hover': {
      fill: palette.light,
    },
  };
});

export const MinorGroup = styled('g', {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => {
  const palette = selected ? theme.palette.secondary : theme.palette.primary;
  return {
    fill: palette.dark,
    cursor: 'pointer',
    transition: theme.transitions.create('fill'),
    ':hover': {
      fill: palette.light,
    },
  };
});

export const NoteText = styled('text')(({ theme }) => ({
  fill: theme.palette.background.default,
  textAnchor: 'middle',
  dominantBaseline: 'middle',
}));

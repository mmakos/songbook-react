import { styled } from '@mui/material';

export const MajorGroup = styled('g')(({ theme }) => ({
  fill: theme.palette.primary.main,
  cursor: 'pointer',
  transition: theme.transitions.create('fill'),
  ':hover': {
    fill: theme.palette.primary.light,
  },
}));

export const MinorGroup = styled('g')(({ theme }) => ({
  fill: theme.palette.primary.dark,
  cursor: 'pointer',
  transition: theme.transitions.create('fill'),
  ':hover': {
    fill: theme.palette.primary.light,
  },
}));

export const NoteText = styled('text')(({ theme }) => ({
  fill: theme.palette.background.default,
  textAnchor: 'middle',
  dominantBaseline: 'middle',
}));

export const ChosenNoteText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'middle',
  fontSize: theme.typography.h5.fontSize,
}));

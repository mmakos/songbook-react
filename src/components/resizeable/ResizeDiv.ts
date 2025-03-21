import { styled } from '@mui/material';

type Position = 'top' | 'bottom' | 'left' | 'right';
const WIDTH = '5px';

const ResizeDiv = styled('div', {
  shouldForwardProp: (prop) => prop !== 'resizing' && prop !== 'position',
})<{ resizing: boolean; position: Position }>(({ resizing, position, theme }) => {
  const horizontal = position === 'top' || position === 'bottom';

  return {
    userSelect: 'none',
    cursor: horizontal ? 'ns-resize' : 'ew-resize',
    top: position === 'bottom' ? 'auto' : 0,
    right: position === 'left' ? 'auto' : 0,
    bottom: position === 'top' ? 'auto' : 0,
    left: position === 'right' ? 'auto' : 0,
    zIndex: 10,
    transition: theme.transitions.create('background'),
    background: resizing ? theme.palette.primary.main : 'transparent',
    ':hover': {
      background: theme.palette.primary.main,
    },
    borderRadius: `calc(${WIDTH} / 2)`,
    width: horizontal ? 'auto' : WIDTH,
    height: !horizontal ? 'auto' : WIDTH,
  };
});

export default ResizeDiv;

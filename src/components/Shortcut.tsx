import { FC } from 'react';
import { styled } from '@mui/material';

interface ShortcutProps {
  baseKey: string;
  mod?: boolean;
  alt?: boolean;
  shift?: boolean;
}

const StyledShortcut = styled('kbd')(({ theme }) => ({
  border: '1px solid',
  borderRadius: theme.shape.borderRadius,
  padding: '1px 3px',
  background: theme.palette.background.default,
  fontWeight: 'bold',
}));

const isMac = navigator.platform.indexOf('Mac') > -1;

const Shortcut: FC<ShortcutProps> = ({ baseKey, mod, alt, shift }) => {
  return (
    <StyledShortcut>
      {mod && (isMac ? 'Cmd+' : 'Ctrl+')}
      {alt && 'Alt+'}
      {shift && 'Shift+'}
      {baseKey}
    </StyledShortcut>
  );
};

export default Shortcut;

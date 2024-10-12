import { FC, MouseEvent, useState } from 'react';
import { Menu, Typography } from '@mui/material';
import { IMainMenuGroupProps } from './MainMenuGroup.tsx';
import LowercaseButton from '../../components/LowercaseButton.tsx';

const MainMenuAppBarGroup: FC<Omit<IMainMenuGroupProps, 'type'>> = ({
  children,
  text,
  icon,
  expanded,
  setExpanded,
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const handleExpand = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
    setExpanded(true);
  };

  return (
    <>
      <LowercaseButton onClick={handleExpand} startIcon={icon} color="inherit" sx={{ mr: '0.5em' }}>
        <Typography>{text}</Typography>
      </LowercaseButton>
      <Menu anchorEl={anchor} keepMounted open={!!expanded && !!anchor} onClose={() => setExpanded(false)}>
        {children}
      </Menu>
    </>
  );
};

export default MainMenuAppBarGroup;

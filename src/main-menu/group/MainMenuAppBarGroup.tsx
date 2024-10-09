import { FC, MouseEvent, useState } from 'react';
import { Button, Menu, Typography } from '@mui/material';
import { IMainMenuGroupProps } from './MainMenuGroup.tsx';

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
      <Button onClick={handleExpand} startIcon={icon} color="inherit" sx={{ mr: '0.5em' }}>
        <Typography>{text}</Typography>
      </Button>
      <Menu anchorEl={anchor} keepMounted open={!!expanded && !!anchor} onClose={() => setExpanded(false)}>
        {children}
      </Menu>
    </>
  );
};

export default MainMenuAppBarGroup;

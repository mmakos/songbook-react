import { FC } from 'react';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { IMainMenuGroupProps } from './MainMenuGroup.tsx';
import { ExpandMore } from '@mui/icons-material';

const MainMenuDrawerGroup: FC<Omit<IMainMenuGroupProps, 'type'>> = ({
  children,
  text,
  icon,
  expanded,
  setExpanded,
}) => {
  const theme = useTheme();

  return (
    <>
      <ListItemButton onClick={() => setExpanded(!expanded)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
        <ExpandMore sx={{ rotate: expanded ? '180deg' : '0deg', transition: theme.transitions.create('rotate') }} />
      </ListItemButton>
      <Collapse in={expanded} timeout="auto">
        <List>{children}</List>
      </Collapse>
    </>
  );
};

export default MainMenuDrawerGroup;

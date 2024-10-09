import { Drawer, IconButton, List, useMediaQuery, useTheme } from '@mui/material';
import { Menu } from '@mui/icons-material';
import MainMenuTabs from './MainMenuTabs.tsx';
import { useState } from 'react';

const DrawerMenu = () => {
  const theme = useTheme();
  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <Menu />
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)} anchor={downSm ? 'top' : 'left'}>
        <List>
          <MainMenuTabs type="drawer" close={() => setOpen(false)} />
        </List>
      </Drawer>
    </>
  );
};

export default DrawerMenu;

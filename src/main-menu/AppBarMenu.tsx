import MainMenuTabs from './MainMenuTabs.tsx';
import { Box } from '@mui/material';

const AppBarMenu = () => {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex' }}>
      <MainMenuTabs type="appbar"  close={() => {}}/>
    </Box>
  );
};

export default AppBarMenu;

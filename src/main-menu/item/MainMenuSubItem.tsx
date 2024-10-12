import { FC } from 'react';
import { IMainMenuItemProps } from './MainMenuItem.tsx';
import { useNavigate } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText, MenuItem, Typography } from '@mui/material';

const MainMenuSubItem: FC<IMainMenuItemProps & { close: () => void }> = ({
  type,
  icon,
  text,
  routeTo,
  href,
  close,
}) => {
  const navigate = useNavigate();

  const handleMenuItemClicked = () => {
    if (routeTo) {
      navigate(routeTo);
    } else if (href) {
      window.open(href, '_blank');
    }
    close();
  };

  if (type === 'drawer') {
    return (
      <ListItemButton onClick={handleMenuItemClicked} sx={{pl: '2em'}}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={text} />
      </ListItemButton>
    );
  } else {
    return (
      <MenuItem onClick={handleMenuItemClicked}>
        {icon}
        <Typography ml={icon ? '0.5em' : 0}>{text}</Typography>
      </MenuItem>
    );
  }
};

export default MainMenuSubItem;

import { FC, ReactNode } from 'react';
import { ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LowercaseButton from '../../components/LowercaseButton.tsx';

export type TMenuType = 'drawer' | 'appbar';

export interface IMainMenuItemProps {
  type: TMenuType;
  routeTo?: string;
  href?: string;
  text: ReactNode;
  icon?: ReactNode;
  close: () => void;
}

const MainMenuItem: FC<IMainMenuItemProps> = ({ type, icon, text, routeTo, href, close }) => {
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
      <ListItemButton onClick={handleMenuItemClicked}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={text} />
      </ListItemButton>
    );
  } else {
    return (
      <LowercaseButton onClick={handleMenuItemClicked} startIcon={icon} color="inherit" sx={{ mr: '0.5em' }}>
        <Typography>{text}</Typography>
      </LowercaseButton>
    );
  }
};

export default MainMenuItem;

import { FC, PropsWithChildren } from 'react';
import { IMainMenuItemProps, TMenuType } from './MainMenuItem.tsx';
import { useNavigate } from 'react-router';
import { ListItemButton, ListItemIcon, ListItemText, MenuItem } from '@mui/material';

const MainMenuSubItemComponent: FC<PropsWithChildren & { type: TMenuType; onClick: () => void }> = ({
  type,
  onClick,
  children,
}) => {
  return type === 'drawer' ? (
    <ListItemButton onClick={onClick} sx={{ pl: '2em' }}>
      {children}
    </ListItemButton>
  ) : (
    <MenuItem onClick={onClick}>{children}</MenuItem>
  );
};

const MainMenuSubItem: FC<IMainMenuItemProps & { close: () => void }> = ({
  type,
  icon,
  text,
  routeTo,
  href,
  onClick,
  inset,
  close,
}) => {
  const navigate = useNavigate();

  const handleMenuItemClicked = () => {
    if (routeTo) {
      navigate(routeTo);
    } else if (href) {
      window.open(href, '_blank');
    } else if (onClick) {
      onClick();
    }
    close();
  };

  return (
    <MainMenuSubItemComponent onClick={handleMenuItemClicked} type={type}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText primary={text} inset={inset} />
    </MainMenuSubItemComponent>
  );
};

export default MainMenuSubItem;

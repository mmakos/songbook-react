import { Children, FC, MouseEvent, PropsWithChildren, ReactNode } from 'react';
import { Button, Menu, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface IMainMenuItemProps extends PropsWithChildren {
  name: string;
  icon?: ReactNode;
  routeTo?: string;
  anchor?: HTMLElement | null;
  setAnchor?: (anchor: HTMLElement | null) => void;
}

const MainMenuButton: FC<IMainMenuItemProps> = ({ children, name, icon, routeTo, anchor, setAnchor }) => {
  const navigate = useNavigate();

  const handleClicked = (event: MouseEvent<HTMLElement>) => {
    if (Children.count(children) > 0 && setAnchor) {
      setAnchor(event.currentTarget);
    } else if (routeTo) {
      navigate(routeTo);
    }
  };

  const handleClose = () => {
    setAnchor?.(null);
  };

  return (
    <>
      <Button onClick={handleClicked} startIcon={icon} color='inherit' sx={{mr: '0.5em'}}>
        <Typography>{name}</Typography>
      </Button>
      {Children.count(children) > 0 && (
        <Menu anchorEl={anchor} keepMounted open={!!anchor} onClose={handleClose}>
          {children}
        </Menu>
      )}
    </>
  );
};

export default MainMenuButton;

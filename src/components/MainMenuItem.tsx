import { FC, ReactNode } from 'react';
import { MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface IMainMenuNestedItemProps {
  name: string;
  routeTo?: string;
  href?: string;
  close: () => void;
  icon?: ReactNode;
}

const MainMenuItem: FC<IMainMenuNestedItemProps> = ({ name, routeTo, href, close, icon }) => {
  const navigate = useNavigate();

  const handleMenuItemClicked = () => {
    if (routeTo) {
      navigate(routeTo);
    } else if (href) {
      window.open(href, '_blank');
    }
    close();
  };

  return (
    <MenuItem onClick={handleMenuItemClicked}>
      {icon}
      <Typography ml={icon ? '0.5em' : 0}>{name}</Typography>
    </MenuItem>
  );
};

export default MainMenuItem;

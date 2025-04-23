import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { ListItemButton, ListItemButtonProps } from '@mui/material';

interface IRouteListButtonProps extends PropsWithChildren, ListItemButtonProps {
  to: string;
}

const RouteListButton: FC<IRouteListButtonProps> = ({ to, children, ...props }) => {
  return (
    <ListItemButton component={Link} to={to} {...props}>
      {children}
    </ListItemButton>
  );
};

export default RouteListButton;

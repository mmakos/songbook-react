import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, IconButtonProps } from '@mui/material';

interface IRouteIconButtonProps extends PropsWithChildren, IconButtonProps {
  to: string;
}

const RouteIconButton: FC<IRouteIconButtonProps> = ({ to, children, ...props }) => {
  return (
    <IconButton component={Link} to={to} {...props}>
      {children}
    </IconButton>
  );
};

export default RouteIconButton;

import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonProps } from '@mui/material';

interface IRouteButtonProps extends PropsWithChildren, ButtonProps {
  to: string;
}

const RouteButton: FC<IRouteButtonProps> = ({ to, children, ...props }) => {
  return (
    <Button component={Link} to={to} {...props}>
      {children}
    </Button>
  );
};

export default RouteButton;

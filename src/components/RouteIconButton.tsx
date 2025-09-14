import { PropsWithChildren, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, IconButtonProps } from '@mui/material';

interface IRouteIconButtonProps extends PropsWithChildren, IconButtonProps {
  to: string;
}

const RouteIconButton = forwardRef(({ to, children, ...props }: IRouteIconButtonProps, _ref) => {
  return (
    <IconButton component={Link} to={to} ref={_ref} {...props}>
      {children}
    </IconButton>
  );
});

export default RouteIconButton;

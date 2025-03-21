import { FC, PropsWithChildren } from 'react';
import MuiLink, { LinkProps } from '@mui/material/Link';
import { Link } from 'react-router';

interface IRouteLinkProps extends PropsWithChildren, LinkProps {
  to: string;
}

const RouteLink: FC<IRouteLinkProps> = ({ to, children, ...props }) => {
  return (
    <MuiLink component={Link} to={to} {...props}>
      {children}
    </MuiLink>
  );
};

export default RouteLink;

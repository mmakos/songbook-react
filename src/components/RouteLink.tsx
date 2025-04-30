import { FC, PropsWithChildren } from 'react';
import MuiLink, { LinkProps } from '@mui/material/Link';
import { Link } from 'react-router';

interface IRouteLinkProps extends PropsWithChildren, LinkProps {
  to?: string;
  href?: string;
}

const RouteLink: FC<IRouteLinkProps> = ({ to, href, children, ...props }) => {
  return to ? (
    <MuiLink component={Link} to={to} {...props}>
      {children}
    </MuiLink>
  ) : (
    <MuiLink href={href} target="_blank" rel="noopener" {...props}>
      {children}
    </MuiLink>
  );
};

export default RouteLink;

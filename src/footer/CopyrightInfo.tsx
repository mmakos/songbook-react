import { Link, Typography } from '@mui/material';
import { FC } from 'react';

const currentYear = new Date().getFullYear();

const CopyrightInfo: FC = () => {
  return (
    <div style={{ justifyContent: 'center', display: 'flex', margin: '0.3em 0' }}>
      <Typography variant="caption" color="textDisabled">
        &copy; 2015-{currentYear} Michał Makoś | <Link href="/terms-of-service.html">Regulamin</Link> |{' '}
        <Link href="/privacy-policy.html">Polityka prywatności</Link>
      </Typography>
    </div>
  );
};

export default CopyrightInfo;

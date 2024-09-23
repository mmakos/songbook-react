import { Typography } from '@mui/material';
import { FC } from 'react';

const currentYear = new Date().getFullYear();

const CopyrightInfo: FC = () => {
  return (
    <Typography sx={{ display: 'flex', justifyContent: 'center', m: '0.3em 0' }} variant="caption" color="textDisabled">
      © 2015-{currentYear} Michał Makoś
    </Typography>
  );
};

export default CopyrightInfo;

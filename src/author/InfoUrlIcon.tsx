import React, { FC } from 'react';
import { Instagram } from '@mui/icons-material';
import Wikipedia from '../components/icon/Wikipedia.tsx';
import { SvgIconProps } from '@mui/material';

const InfoUrlIcon: FC<SvgIconProps & { url: string }> = ({ url, ...props }) => {
  if (url.includes('wikipedia.org')) {
    return <Wikipedia {...props} />;
  } else if (url.includes('instagram.com')) {
    return <Instagram {...props} />;
  }
};

export default InfoUrlIcon;

import { FC } from 'react';
import { Tooltip, TooltipProps } from '@mui/material';

const BasicTooltip: FC<TooltipProps> = ({ children, ...props }) => {
  return (
    <Tooltip enterDelay={500} {...props}>
      {children}
    </Tooltip>
  );
};

export default BasicTooltip;

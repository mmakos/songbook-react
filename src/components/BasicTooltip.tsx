import { Attributes, FC } from 'react';
import { Tooltip, TooltipProps } from '@mui/material';

const BasicTooltip: FC<TooltipProps & Attributes> = ({ children, ...props }) => {
  return (
    <Tooltip enterDelay={500} {...props} arrow>
      <span>{children}</span>
    </Tooltip>
  );
};

export default BasicTooltip;

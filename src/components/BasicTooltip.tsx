import { Attributes, FC } from 'react';
import { Tooltip, TooltipProps } from '@mui/material';

const BasicTooltip: FC<TooltipProps & Attributes & { span?: boolean }> = ({ children, span, ...props }) => {
  return (
    <Tooltip enterDelay={500} {...props} arrow>
      {span ? <span style={{ lineHeight: 1, ...props.style }}>{children}</span> : children}
    </Tooltip>
  );
};

export default BasicTooltip;

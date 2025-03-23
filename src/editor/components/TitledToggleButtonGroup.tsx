import StyledToggleButtonGroup from '../../components/StyledToggleButtonGroup.tsx';
import { FC, ReactNode, useState } from 'react';
import {Divider, Fade, ToggleButtonGroupProps, Typography} from '@mui/material';

export const TitledToggleButtonGroupDivider = () => {
  return <Divider flexItem orientation="vertical" sx={{ mx: 0.5, mb: 0.7 }} />;
};

const TitledToggleButtonGroup: FC<ToggleButtonGroupProps & { title: string; icon?: ReactNode }> = ({
  title,
  icon,
  children,
  ...props
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
      onMouseEnter={icon ? () => setHover(true) : undefined}
      onMouseLeave={icon ? () => setHover(false) : undefined}
    >
      <Typography variant="caption" alignSelf="center" lineHeight={1} color="textDisabled">
        {title}
      </Typography>
      <StyledToggleButtonGroup size="small" {...props}>
        {children}
      </StyledToggleButtonGroup>
      {icon && (
        <Fade in={hover}>
          <div style={{ position: 'absolute', right: '0.4em', top: '-3px', height: '1em' }}>{icon}</div>
        </Fade>
      )}
    </div>
  );
};

export default TitledToggleButtonGroup;

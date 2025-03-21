import StyledToggleButtonGroup from '../../components/StyledToggleButtonGroup.tsx';
import { FC } from 'react';
import {Divider, ToggleButtonGroupProps, Typography} from '@mui/material';

export const TitledToggleButtonGroupDivider = () => {
  return <Divider flexItem orientation="vertical" sx={{ mx: 0.5, mb: 0.7 }} />;
};

const TitledToggleButtonGroup: FC<ToggleButtonGroupProps & { title: string }> = ({ title, children, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant='caption' alignSelf='center' lineHeight={1} color='textDisabled'>{title}</Typography>
      <StyledToggleButtonGroup size="small" {...props}>{children}</StyledToggleButtonGroup>
    </div>
  );
};

export default TitledToggleButtonGroup;

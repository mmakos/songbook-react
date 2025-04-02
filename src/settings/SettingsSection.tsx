import { Divider, Stack, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { FC, PropsWithChildren } from 'react';

interface ISettingsSectionProps {
  title: string;
  titleVariant?: Variant;
}

const SettingsSection: FC<ISettingsSectionProps & PropsWithChildren> = ({ titleVariant, title, children }) => {
  return (
    <Stack spacing={1} useFlexGap>
      <Typography variant={titleVariant ?? 'h4'}>{title}</Typography>
      <Divider variant="fullWidth" sx={{ mb: '0.5em' }} />
      {children}
    </Stack>
  );
};

export default SettingsSection;

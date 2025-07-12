import { Stack, Typography } from '@mui/material';
import BasicHelmet from '../../subsites/BasicHelmet.tsx';
import Wilks from './Wilks.tsx';

const Strength = () => {
  return (
    <Stack spacing={2} maxWidth="100%">
      <BasicHelmet title="Kalkulator siły" />
      <Typography variant="h3">Kalkulator siły</Typography>
      <Wilks />
    </Stack>
  );
};

export default Strength;

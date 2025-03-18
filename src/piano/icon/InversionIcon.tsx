import { createSvgIcon } from '@mui/material';
import { FC } from 'react';

const NoInversion = createSvgIcon(
  <g fill="none" strokeWidth={2} stroke="currentColor">
    <ellipse cx="12" cy="6" rx="4" ry="3" />
    <ellipse cx="12" cy="12" rx="4" ry="3" />
    <ellipse cx="12" cy="18" rx="4" ry="3" />
  </g>,
  'No inversion'
);

const FirstInversion = createSvgIcon(
  <g fill="none" strokeWidth={2} stroke="currentColor">
    <ellipse cx="12" cy="4" rx="4" ry="3" />
    <ellipse cx="12" cy="14" rx="4" ry="3" />
    <ellipse cx="12" cy="20" rx="4" ry="3" />
  </g>,
  'First inversion'
);

const SecondInversion = createSvgIcon(
  <g fill="none" strokeWidth={2} stroke="currentColor">
    <ellipse cx="12" cy="4" rx="4" ry="3" />
    <ellipse cx="12" cy="10" rx="4" ry="3" />
    <ellipse cx="12" cy="20" rx="4" ry="3" />
  </g>,
  'Second inversion'
);

const InversionIcon: FC<{ inversion: number }> = ({ inversion }) => {
  switch (inversion) {
    case 1:
      return <FirstInversion />;
    case 2:
      return <SecondInversion />;
  }
  return <NoInversion />;
};

export default InversionIcon;

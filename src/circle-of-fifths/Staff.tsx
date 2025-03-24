import TrebleClefPath from './TrebleClefPath.tsx';
import { FC, SVGProps } from 'react';
import { useTheme } from '@mui/material';

const Staff: FC<SVGProps<SVGSVGElement>> = ({ children, ...props }) => {
  const theme = useTheme();

  return (
    <svg viewBox="0 -30 300 160" {...props}>
      <g stroke={theme.palette.text.primary} strokeWidth={1}>
        <path d="M 0 0 H 300 M 0 25 H 300 M 0 50 H 300 M 0 75 H 300 M 0 100 H 300" />
        <line x1={3} y1={0} x2={1} y2={100} strokeWidth={7} />
      </g>
      <TrebleClefPath fill={theme.palette.text.primary} transform="translate(10, -45) scale(0.18, 0.18)" />
      {children}
    </svg>
  );
};

export default Staff;

import { IKey } from '../types/song.types.ts';
import Staff from './Staff.tsx';
import { FC, SVGProps } from 'react';
import { getPositionOnCircle } from '../chords/chord-transposition.tsx';
import {useTheme} from "@mui/material";

interface IKeyStaff {
  staffKey: IKey;
}

const KeyStaff: FC<IKeyStaff & SVGProps<SVGSVGElement>> = ({ staffKey, ...props }) => {
  const theme = useTheme();
  
  const position = getPositionOnCircle(staffKey);
  const signs = Math.abs(position);
  const flat = position < 0;
  const sign = flat ? '♭' : '♯';
  const startPos = flat ? 6 : 0;
  const step = flat ? 50 : 37.5;
  const shift = flat ? 0 : 12.5;
  const transY = flat ? 8 : 2;
  const gapX = flat ? 23 : 20;
  const fontSize = flat ? 65 : 45;

  const positions = Array.from(Array(signs), (_, i) => {
    return (((i + startPos) * step + shift) % 87.5) - shift;
  });

  return (
    <Staff {...props}>
      <g
        fill={theme.palette.text.primary}
        fontSize={fontSize}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`translate(0, ${transY})`}
      >
        {positions.map((pos, i) => (
          <text key={`s${pos}`} x={100 + gapX * i} y={pos}>
            {sign}
          </text>
        ))}
      </g>
    </Staff>
  );
};

export default KeyStaff;

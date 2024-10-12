import { FC, ReactElement } from 'react';
import { Chip, IconButton } from '@mui/material';
import BasicTooltip from '../components/BasicTooltip.tsx';

export type TSongControlType = 'chip' | 'button';

export interface ISongControlProps {
  type: 'chip' | 'button';
  icon: ReactElement;
  label: string;
  onClick: () => void;
  selected?: boolean;
}

const SongControl: FC<ISongControlProps> = ({ type, icon, label, onClick, selected }) => {
  if (type === 'chip') {
    return <Chip label={label} icon={icon} onClick={onClick} variant={selected ? 'filled' : 'outlined'} />;
  } else {
    return (
      <BasicTooltip title={label}>
        <IconButton onClick={onClick}>{icon}</IconButton>
      </BasicTooltip>
    );
  }
};

export default SongControl;

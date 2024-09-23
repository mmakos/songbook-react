import { FC, ReactElement, ReactNode, useState } from 'react';
import { Fade, FormControlLabel, Switch } from '@mui/material';

interface IExpandableSwitchProps {
  label: ReactNode;
  expansion: ReactElement;
  checked?: boolean;
  onChange: (value: boolean) => void;
}

const ExpandableSwitch: FC<IExpandableSwitchProps> = ({ label, expansion, checked, onChange }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <FormControlLabel
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      control={<Switch checked={checked} onChange={(_, value) => onChange(value)} />}
      label={
        <div style={{display: 'flex', alignItems: 'center'}}>
          {label}
          <Fade in={expanded}><div style={{marginLeft: '0.5em'}}>{expansion}</div></Fade>
        </div>
      }
    />
  );
};

export default ExpandableSwitch;

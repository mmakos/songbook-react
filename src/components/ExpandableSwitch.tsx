import { FC, ReactElement, ReactNode, useState } from 'react';
import { Fade, FormControlLabel, Switch, SxProps, Typography } from '@mui/material';

interface IExpandableSwitchProps {
  label: ReactNode;
  expansion?: ReactElement;
  description?: ReactElement;
  checked?: boolean;
  onChange: (value: boolean) => void;
  sx?: SxProps;
}

const ExpandableSwitch: FC<IExpandableSwitchProps> = ({ label, expansion, description, checked, onChange, sx }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <FormControlLabel
        sx={sx}
        onMouseEnter={() => expansion && setExpanded(true)}
        onMouseLeave={() => expansion && setExpanded(false)}
        control={<Switch checked={checked} onChange={(_, value) => onChange(value)} />}
        label={
          <>
            {label}
            {expansion && (
              <Fade in={expanded} unmountOnExit>
                <span style={{ marginLeft: '0.5em' }}>{expansion}</span>
              </Fade>
            )}
          </>
        }
      />
      {description && (
        <Typography variant="caption" fontStyle="italic">
          {description}
        </Typography>
      )}
    </>
  );
};

export default ExpandableSwitch;

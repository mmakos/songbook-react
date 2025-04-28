import { FC, ReactElement, ReactNode, useState } from 'react';
import { Collapse, FormControlLabel, Stack, Switch, SxProps, Typography } from '@mui/material';

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
          <Stack position="relative">
            {label}
            {expansion && (
              <Collapse in={expanded}>
                <Typography color="text.secondary">
                  {expansion}
                </Typography>
              </Collapse>
            )}
          </Stack>
        }
      />
      {(description || expansion) && (
        <Typography variant="caption" fontStyle="italic">
          {description}
        </Typography>
      )}
    </>
  );
};

export default ExpandableSwitch;

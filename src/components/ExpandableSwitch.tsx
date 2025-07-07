import { FC, ReactElement, ReactNode, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

interface IExpandableSwitchProps {
  label: ReactNode;
  expansion?: ReactElement;
  description?: ReactElement;
  checked?: boolean;
  onChange: (value: boolean) => void;
  showDescription?: boolean;
  disabled?: boolean;
}

const ExpandableSwitch: FC<IExpandableSwitchProps> = ({
  label,
  expansion,
  description,
  checked,
  onChange,
  showDescription,
  disabled,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [help, setHelp] = useState(false);

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <FormControlLabel
          onMouseEnter={() => expansion && setExpanded(true)}
          onMouseLeave={() => expansion && setExpanded(false)}
          control={<Switch checked={checked} onChange={(_, value) => onChange(value)} />}
          label={
            <Stack>
              {label}
              {expansion && (
                <Collapse in={expanded}>
                  <Typography color={disabled ? 'text.disabled' : 'text.secondary'}>{expansion}</Typography>
                </Collapse>
              )}
            </Stack>
          }
          disabled={disabled}
        />
        {!showDescription && description && (
          <Box>
            <IconButton size="small" onClick={() => setHelp(true)}>
              <HelpOutline color="disabled" />
            </IconButton>
          </Box>
        )}
      </Stack>
      {showDescription && (description || expansion) && (
        <Typography variant="caption" color={disabled ? 'text.disabled' : 'text.secondary'}>
          {description}
        </Typography>
      )}
      <Dialog open={help} onClose={() => setHelp(false)}>
        <DialogTitle>{label}</DialogTitle>
        <DialogContent>
          <Typography mb="0.5em">Przykład: {expansion}</Typography>
          {description}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelp(false)}>Zamknij</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default ExpandableSwitch;

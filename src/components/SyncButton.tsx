import { Box, CircularProgress, IconButton } from '@mui/material';
import { Sync } from '@mui/icons-material';
import { FC } from 'react';
import BasicTooltip from './BasicTooltip.tsx';

interface ISyncButtonProps {
  sync: () => void;
  syncing?: boolean;
  tooltip?: string;
}

const SyncButton: FC<ISyncButtonProps> = ({ sync, syncing, tooltip }) => {
  return (
    <Box ml="auto" position="relative">
      <BasicTooltip title={tooltip ?? 'Odśwież'}>
        <IconButton sx={{ ml: 'auto' }} onClick={sync} disabled={syncing}>
          <Sync />
        </IconButton>
      </BasicTooltip>
      {syncing && <CircularProgress sx={{ ml: 'auto', position: 'absolute', right: 0, top: 0 }} />}
    </Box>
  );
};

export default SyncButton;

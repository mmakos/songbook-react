import { FC, useState } from 'react';
import { IWaitingEdit } from '../types/song.types.ts';
import { Collapse, IconButton, Stack, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import RouteLink from '../components/RouteLink.tsx';

const WaitingEditsInfo: FC<{ waiting: IWaitingEdit; routeTo: string }> = ({ waiting, routeTo }) => {
  const [open, setOpen] = useState(false);

  if (!waiting.waiting) return;

  const sorted = [...waiting.waiting].sort((a, b) => b.editTime - a.editTime);

  return (
    <Collapse in={open} collapsedSize="1.75em">
      <Stack>
        <Typography variant="caption" color="textSecondary" display="flex" alignItems="center" gap="1em">
          Poczekalnia
          <IconButton onClick={() => setOpen(!open)} size="small">
            <ExpandMore
              fontSize="inherit"
              sx={{
                transform: `rotate(${open ? -180 : 0}deg)`,
                transition: (theme) => theme.transitions.create('transform'),
              }}
            />
          </IconButton>
        </Typography>
        {sorted.map((w) => (
          <Typography variant="caption" color="textSecondary" key={w.username}>
            <RouteLink to={`${routeTo}/${w.username}`} color="primary.dark">
              {w.username}
            </RouteLink>{' '}
            edytował {new Date(w.editTime * 1000).toLocaleString()}
          </Typography>
        ))}
        <Typography variant="caption" color="textSecondary">
          <RouteLink to={routeTo} color="primary.dark" fontStyle='italic'>
            Oryginał
          </RouteLink>
        </Typography>
      </Stack>
    </Collapse>
  );
};

export default WaitingEditsInfo;

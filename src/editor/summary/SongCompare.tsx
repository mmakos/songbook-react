import { Stack, ToggleButton, useTheme } from '@mui/material';
import DiffViewer from 'react-diff-viewer-continued';
import { ISongEdit } from '../../types/song.types.ts';
import { FC, useMemo, useState } from 'react';
import TitledToggleButtonGroup from '../components/TitledToggleButtonGroup.tsx';
import BasicTooltip from '../../components/BasicTooltip.tsx';
import { Reorder, VerticalSplitOutlined } from '@mui/icons-material';

interface ISongCompareProps {
  oldSong: ISongEdit;
  newSong: ISongEdit;
}

const SongCompare: FC<ISongCompareProps> = ({ oldSong, newSong }) => {
  const theme = useTheme();
  const [split, setSplit] = useState(true);

  const [jsonOld, jsonNew] = useMemo(() => {
    return [JSON.stringify(oldSong, undefined, 2), JSON.stringify(newSong, undefined, 2)];
  }, [oldSong, newSong]);

  return (
    <Stack>
      <TitledToggleButtonGroup
        size="small"
        exclusive
        value={split ? 'split' : 'unified'}
        onChange={(_, prev: string) => setSplit(prev !== 'unified')}
        title="Podgląd"
      >
        <BasicTooltip title="Edytor">
          <ToggleButton value="unified">
            <Reorder />
          </ToggleButton>
        </BasicTooltip>
        <BasicTooltip title="Edytor i podgląd">
          <ToggleButton value="split">
            <VerticalSplitOutlined />
          </ToggleButton>
        </BasicTooltip>
      </TitledToggleButtonGroup>
      <DiffViewer
        oldValue={jsonOld}
        newValue={jsonNew}
        useDarkTheme={theme.palette.mode === 'dark'}
        leftTitle="Obecna wersja"
        rightTitle="Edytowana wersja"
        splitView={split}
        codeFoldMessageRenderer={(totalFoldedLines) => <>Rozwiń {totalFoldedLines} linii...</>}
      />
    </Stack>
  );
};

export default SongCompare;

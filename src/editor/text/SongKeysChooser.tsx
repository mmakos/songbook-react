import KeyChooser from '../../circle-of-fifths/KeyChooser.tsx';
import { useState } from 'react';
import { IKey } from '../../types/song.types.ts';
import Grid from '@mui/material/Grid2';

const SongKeysChooser = () => {
  const [songbookKey, setSongbookKey] = useState<IKey>();
  const [originalKey, setOriginalKey] = useState<IKey>();
  const [comfortKey, setComfortKey] = useState<IKey>();
  const [maxComfortKey, setMaxComfortKey] = useState<IKey>();

  return (
    <div>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KeyChooser
            fullWidth
            label="Tonacja w śpiewniku"
            helperText="W jakiej tonacji wpisałeś akordy"
            required
            chosenKey={songbookKey}
            setChosenKey={setSongbookKey}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KeyChooser
            fullWidth
            label="Tonacja oryginalna"
            helperText="Najlepiej z nagrania, które załączyłeś"
            chosenKey={originalKey}
            setChosenKey={setOriginalKey}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KeyChooser
            fullWidth
            label={maxComfortKey ? 'Minimalna tonacja' : 'Tonacja komfortowa'}
            helperText={`${maxComfortKey ? 'Minimalna p' : 'P'}roponowana przez ciebie tonacja`}
            chosenKey={comfortKey}
            setChosenKey={setComfortKey}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KeyChooser
            fullWidth
            label="Maksymalna tonacja"
            helperText="Maksymalna proponowana przez ciebie tonacja"
            chosenKey={maxComfortKey}
            setChosenKey={setMaxComfortKey}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default SongKeysChooser;

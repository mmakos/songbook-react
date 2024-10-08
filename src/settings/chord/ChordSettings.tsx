import ChordDifficulty from './ChordDifficulty.tsx';
import { Divider, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';
import ChordDifficultyPreset from './ChordDifficultyPreset.tsx';
import ExpandableSwitch from '../../components/ExpandableSwitch.tsx';
import ChordStyle from './ChordStyle.tsx';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';
import { setGlobalChordsDifficulty, setNoChordInfo, setNoChords } from '../../store/songbook.reducer.ts';

const ChordSettings = () => {
  const { noChords, noChordInfo, chordDifficulty } = useAppSelector((state) => state.songbookSettings);
  const dispatch = useAppDispatch();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4">Ustawienia akordów</Typography>
      <Divider variant="fullWidth" sx={{ mt: '0.5em', mb: '1em' }} />
      <FormGroup>
        <ExpandableSwitch
          label="Pokazuj informacje instrumentalne"
          onChange={(value) => dispatch(setNoChordInfo(!value))}
          checked={!noChordInfo}
          description={<>Pokazuje informacje, które dotyczą raczej instrumentalistów. W te informacje wliczają się nie tylko akordy, ale także informacje o tonacji piosenki, ustawienia wyświetlania akordów w danej piosence itd.</>}
        />
        <FormControlLabel
          sx={{ mt: '1em' }}
          control={<Switch checked={!noChords} onChange={(_, value) => dispatch(setNoChords(!value))} />}
          label="Pokaż akordy"
        />
      </FormGroup>
      <Typography variant="h5" sx={{ mt: '1rem' }}>
        Styl akordów
      </Typography>
      <Divider variant="fullWidth" sx={{ mt: '0.5em', mb: '1em' }} />
      <ChordStyle />
      <Typography variant="h5" sx={{ mt: '1rem' }}>
        Trudność akordów
      </Typography>
      <Divider variant="fullWidth" sx={{ mt: '0.5em', mb: '1em' }} />
      <ChordDifficultyPreset
        chordDifficulty={chordDifficulty}
        changeDifficulty={(difficulty) => dispatch(setGlobalChordsDifficulty(difficulty))}
        showDescription
      />
      <Typography variant="h6" sx={{ mt: '0.8rem', mb: '0.5rem' }}>
        Szczegółowe ustawienia trudności
      </Typography>
      <ChordDifficulty
        chordDifficulty={chordDifficulty}
        changeDifficulty={(difficulty) => dispatch(setGlobalChordsDifficulty(difficulty))}
        showDescription
      />
    </div>
  );
};

export default ChordSettings;

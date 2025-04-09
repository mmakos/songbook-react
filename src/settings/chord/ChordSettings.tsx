import ChordDifficulty from './ChordDifficulty.tsx';
import { FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';
import ChordDifficultyPreset from './ChordDifficultyPreset.tsx';
import ExpandableSwitch from '../../components/ExpandableSwitch.tsx';
import ChordStyle from './ChordStyle.tsx';
import { useAppDispatch, useAppSelector } from '../../store/songbook.store.ts';
import { setGlobalChordsDifficulty, setNoChordInfo, setNoChords } from '../../store/songbook.reducer.ts';
import SettingsSection from '../SettingsSection.tsx';

const ChordSettings = () => {
  const { noChords, noChordInfo, chordDifficulty } = useAppSelector((state) => state.songbookSettings);
  const dispatch = useAppDispatch();

  return (
    <SettingsSection title="Ustawienia akordów">
      <FormGroup>
        <ExpandableSwitch
          label="Pokazuj informacje instrumentalne"
          onChange={(value) => dispatch(setNoChordInfo(!value))}
          checked={!noChordInfo}
          description={
            <>
              Pokazuje informacje, które dotyczą raczej instrumentalistów. W te informacje wliczają się nie tylko
              akordy, ale także informacje o tonacji piosenki, ustawienia wyświetlania akordów w danej piosence itd.
            </>
          }
        />
        <FormControlLabel
          sx={{ mt: '1em' }}
          control={<Switch checked={!noChords} onChange={(_, value) => dispatch(setNoChords(!value))} />}
          label="Pokaż akordy"
        />
      </FormGroup>
      <SettingsSection titleVariant="h5" title="Styl akordów">
        <ChordStyle />
      </SettingsSection>
      <SettingsSection titleVariant="h5" title="Trudność akordów">
        <ChordDifficultyPreset
          chordDifficulty={chordDifficulty}
          changeDifficulty={(difficulty) => dispatch(setGlobalChordsDifficulty(difficulty))}
          showDescription
        />
      </SettingsSection>
      <Typography variant="h6" sx={{ mt: '1rem'}}>
        Szczegółowe ustawienia trudności
      </Typography>
      <ChordDifficulty
        chordDifficulty={chordDifficulty}
        changeDifficulty={(difficulty) => dispatch(setGlobalChordsDifficulty(difficulty))}
        showDescription
      />
    </SettingsSection>
  );
};

export default ChordSettings;

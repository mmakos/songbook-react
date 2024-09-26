import {
  ClickAwayListener,
  Collapse,
  FormControlLabel,
  FormGroup,
  IconButton,
  Paper,
  Skeleton,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/songbook.store.ts';
import {
  ArrowDownward,
  ArrowUpward,
  Cached,
  Close,
  ExpandMore,
  SaveOutlined,
  SentimentNeutral,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from '@mui/icons-material';
import { FC, useEffect, useMemo, useState } from 'react';
import {
  changeDifficulty,
  resetTransposition,
  setShowChords,
  setSongSettingsOpen,
  transposeDown,
  transposeUp,
  updateGlobalSettings,
} from '../store/songbook.reducer.ts';
import { keyAsString } from '../chords/chord-display.tsx';
import { transposeKey } from '../chords/chord-transposition.tsx';
import StyledRating from '../components/StyledRating.tsx';
import { getDifficultyFromPreset, getDifficultyPreset } from '../chords/chord-difficulty.tsx';
import ExpandableSwitch from '../components/ExpandableSwitch.tsx';
import BasicTooltip from '../components/BasicTooltip.tsx';

const chordDifficultyIcons = {
  1: {
    icon: <SentimentVeryDissatisfied color="error" fontSize="inherit" />,
    label: 'Początkujący',
  },
  2: {
    icon: <SentimentNeutral color="warning" fontSize="inherit" />,
    label: 'Średnio zaawansowany',
  },
  3: {
    icon: <SentimentVerySatisfied color="success" fontSize="inherit" />,
    label: 'Zaawansowany',
  },
};

const SongSettings: FC = () => {
  const song = useAppSelector((state) => state.song);
  const open = useAppSelector((state) => state.songDisplayState.settingsOpen);
  const { transposition, chordDifficulty, showChords } = useAppSelector((state) => state.songSettings);
  const dispatch = useAppDispatch();
  const difficultyPreset = useMemo(() => {
    return getDifficultyPreset(chordDifficulty);
  }, [chordDifficulty]);
  const [hoverPreset, setHoverPreset] = useState(difficultyPreset as number | undefined);
  const [moreSettings, setMoreSettings] = useState(false);

  useEffect(() => {
    setHoverPreset(difficultyPreset);
  }, [difficultyPreset]);

  const close = () => {
    dispatch(setSongSettingsOpen(false));
  };

  const key = useMemo(() => {
    return song && keyAsString(transposeKey(song.key.songbook, transposition));
  }, [transposition, song]);

  return (
    <ClickAwayListener onClickAway={() => setMoreSettings(false)}>
      <Collapse in={open} collapsedSize={0}>
        {song ? (
          <Paper
            sx={{ position: 'relative', mb: '0.5em', padding: '0.5em 1em', display: 'flex', flexDirection: 'column' }}
          >
            <FormControlLabel
              control={<Switch checked={showChords} onChange={(_, value) => dispatch(setShowChords(value))} />}
              label="Pokaż akordy"
            />
            <TextField
              value={key}
              size="small"
              label="Tonacja"
              margin="normal"
              slotProps={{
                input: {
                  endAdornment: (
                    <>
                      <IconButton onClick={() => dispatch(transposeDown())} size="small">
                        <ArrowDownward />
                      </IconButton>
                      <IconButton onClick={() => dispatch(transposeUp())} size="small">
                        <ArrowUpward />
                      </IconButton>
                      <IconButton onClick={() => dispatch(resetTransposition())} size="small">
                        <Cached />
                      </IconButton>
                    </>
                  ),
                },
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', margin: '0.5em 0' }}>
              <StyledRating
                size="large"
                max={3}
                highlightSelectedOnly
                value={difficultyPreset}
                onChangeActive={(event, value) => setHoverPreset(value)}
                onChange={(event, value) => value && dispatch(changeDifficulty(getDifficultyFromPreset(value)))}
                IconContainerComponent={(props) => (
                  <span style={{ marginLeft: props.value > 1 ? '0.2em' : 0 }} {...props}>
                    {chordDifficultyIcons[props.value].icon}
                  </span>
                )}
              />
              <Typography style={{ marginLeft: '0.5em' }}>
                {chordDifficultyIcons[hoverPreset]?.label ?? chordDifficultyIcons[difficultyPreset]?.label ?? 'Własna'}
              </Typography>
              <IconButton sx={{ ml: 'auto' }} onClick={() => setMoreSettings(!moreSettings)} size="small">
                <ExpandMore
                  sx={{
                    rotate: moreSettings ? '180deg' : 0,
                    transitionProperty: 'rotate',
                    transitionDuration: '1sec',
                  }}
                />
              </IconButton>
            </div>
            <Collapse in={moreSettings}>
              <FormGroup sx={{ml: '0.3em'}}>
                <ExpandableSwitch
                  label={'Ukryj niestandardowe składniki'}
                  expansion={
                    <>
                      <b>
                        A<sup>6&gt;</sup> E<sup>9&gt;</sup>
                      </b>
                      &nbsp;→&nbsp;
                      <b>A E</b>
                    </>
                  }
                  checked={chordDifficulty.hideUncommonAdditionals}
                  onChange={(value) => dispatch(changeDifficulty({ hideUncommonAdditionals: value }))}
                />
                <ExpandableSwitch
                  label={'Augmentacje i diminucje w notacji gitarowej'}
                  expansion={
                    <>
                      <b>
                        A<sup>7&lt;</sup> e<sup>6&gt;</sup>
                      </b>
                      &nbsp;→&nbsp;
                      <b>
                        A<sup>7+</sup> e<sup>6-</sup>
                      </b>
                    </>
                  }
                  checked={chordDifficulty.guitarIntervalModifications}
                  onChange={(value) => dispatch(changeDifficulty({ guitarIntervalModifications: value }))}
                />
                <ExpandableSwitch
                  label={'Rozdziel opóźnienia na osobne akordy'}
                  expansion={
                    <>
                      <b>
                        A<sup>4-3</sup>
                      </b>
                      &nbsp;→&nbsp;
                      <b>
                        A<sup>4</sup> A
                      </b>
                    </>
                  }
                  checked={chordDifficulty.splitSuspensions}
                  onChange={(value) => dispatch(changeDifficulty({ splitSuspensions: value }))}
                />
                <ExpandableSwitch
                  label={'Ukryj puste kwinty i unison'}
                  expansion={
                    <>
                      <b>
                        A<sup>1</sup> E<sup>5</sup>
                      </b>
                      &nbsp;→&nbsp;
                      <b>A E</b>
                    </>
                  }
                  checked={chordDifficulty.hideUnisonAndFifth}
                  onChange={(value) => dispatch(changeDifficulty({ hideUnisonAndFifth: value }))}
                />
                <ExpandableSwitch
                  label={'Wyświetl max. 1 dodany składnik'}
                  expansion={
                    <>
                      <b>
                        E<sup>64</sup>
                      </b>
                      &nbsp;→&nbsp;
                      <b>
                        E<sup>4</sup>
                      </b>
                    </>
                  }
                  checked={chordDifficulty.singleAdditional}
                  onChange={(value) => dispatch(changeDifficulty({ singleAdditional: value }))}
                />
                <ExpandableSwitch
                  label={'Akordy zmniejszone i zwiększone w notacji gitarowej'}
                  expansion={
                    <>
                      <b>e&gt; A&lt;</b>
                      &nbsp;→&nbsp;
                      <b>
                        e<sup>0</sup> A+
                      </b>
                    </>
                  }
                  checked={chordDifficulty.guitarDiminishedChords}
                  onChange={(value) => dispatch(changeDifficulty({ guitarDiminishedChords: value }))}
                />
                <ExpandableSwitch
                  label={'Ukryj składniki w basie'}
                  expansion={
                    <>
                      <b>
                        A<sub>3</sub>
                      </b>
                      &nbsp;→&nbsp;
                      <b>A</b>
                    </>
                  }
                  checked={chordDifficulty.hideBase}
                  onChange={(value) => dispatch(changeDifficulty({ hideBase: value }))}
                />
                <ExpandableSwitch
                  label={'Ukryj dodany składnik zduplikowany w basie'}
                  expansion={
                    <>
                      <b>
                        a<sub>6</sub>
                        <sup>6</sup>
                      </b>
                      &nbsp;→&nbsp;
                      <b>
                        a<sub>6</sub>
                      </b>
                    </>
                  }
                  checked={chordDifficulty.hideBaseAdditional}
                  onChange={(value) => dispatch(changeDifficulty({ hideBaseAdditional: value }))}
                />
                <ExpandableSwitch
                  label={'Ukryj alternatywne akordy'}
                  expansion={
                    <>
                      <b>
                        C<sup>7&lt;</sup>/e<sup>6&gt;</sup>
                      </b>
                      &nbsp;→&nbsp;
                      <b>
                        C<sup>7&lt;</sup>
                      </b>
                    </>
                  }
                  checked={chordDifficulty.hideAlternatives}
                  onChange={(value) => dispatch(changeDifficulty({ hideAlternatives: value }))}
                />
                <ExpandableSwitch
                  label={'Bemole i krzyżyki jako znaki'}
                  expansion={
                    <>
                      <b>Es Cis</b>
                      &nbsp;→&nbsp;
                      <b>E♭ C♯</b>
                    </>
                  }
                  checked={chordDifficulty.signAccidentals}
                  onChange={(value) => dispatch(changeDifficulty({ signAccidentals: value }))}
                />
              </FormGroup>
            </Collapse>

            <div style={{ position: 'absolute', top: '0.2em', right: '0.2em' }}>
              <BasicTooltip title="Zapisz ustawienia globalnie">
                <IconButton onClick={() => dispatch(updateGlobalSettings())} size="small">
                  <SaveOutlined />
                </IconButton>
              </BasicTooltip>
              <IconButton onClick={close} size="small">
                <Close />
              </IconButton>
            </div>
          </Paper>
        ) : (
          <Skeleton height="5em" />
        )}
      </Collapse>
    </ClickAwayListener>
  );
};

export default SongSettings;

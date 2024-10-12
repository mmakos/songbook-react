import StyledRating from '../../components/StyledRating.tsx';
import { IChordDifficulty } from '../../store/songbook.reducer.ts';
import { getDifficultyFromPreset, getDifficultyPreset, TDifficultyPreset } from '../../chords/chord-difficulty.tsx';
import { Typography } from '@mui/material';
import {
  SentimentNeutral,
  SentimentSatisfiedSharp,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from '@mui/icons-material';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';

const chordDifficultyIcons: Record<number, { icon: ReactNode; label: string; description: string }> = {
  1: {
    icon: <SentimentVeryDissatisfied sx={{ color: '#f23591' }} fontSize="inherit" />,
    label: 'Początkujący',
    description: 'Dopiero zaczyna przygodę z instrumentem - opanował lub stara się opanować podstawowe akordy',
  },
  2: {
    icon: <SentimentNeutral color="error" fontSize="inherit" />,
    label: 'Średnio zaawansowany',
    description: 'Trochę już gra - opanował kilka ciekawszych wariantów akordów',
  },
  3: {
    icon: <SentimentSatisfiedSharp color="warning" fontSize="inherit" />,
    label: 'Zaawansowany',
    description: 'Spędził z instrumentem pół życia - zna wszystkie możliwe warianty akordów',
  },
  4: {
    icon: <SentimentVerySatisfied color="success" fontSize="inherit" />,
    label: 'Muzyk zawodowy',
    description:
      'Jego pojmowanie muzyki nie polega na znajomości wszystkich akordów, za to dogłębnie rozumie świat harmonii i jest zainteresowany wszystkimi jej elementami',
  },
};

const getPresetDescription = (setPreset: TDifficultyPreset, hoveredPreset: TDifficultyPreset) => {
  const preset = hoveredPreset > 0 ? hoveredPreset : setPreset;
  return (
    chordDifficultyIcons[preset]?.description ??
    'Jego umiejętności są tajemnicą, jednak jest na tyle świadomym muzykiem, by samodzielne określić swoje możliwości'
  );
};

interface IChordDifficultyPresetProps {
  chordDifficulty: IChordDifficulty;
  changeDifficulty: (difficulty: IChordDifficulty) => void;
  showDescription?: boolean;
}

const ChordDifficultyPreset: FC<IChordDifficultyPresetProps> = ({
  chordDifficulty,
  changeDifficulty,
  showDescription,
}) => {
  const difficultyPreset = useMemo(() => {
    return getDifficultyPreset(chordDifficulty);
  }, [chordDifficulty]);

  const [hoverPreset, setHoverPreset] = useState(difficultyPreset);

  useEffect(() => {
    setHoverPreset(difficultyPreset);
  }, [difficultyPreset]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StyledRating
          size="large"
          max={4}
          highlightSelectedOnly
          value={difficultyPreset}
          onChangeActive={(_, value) => setHoverPreset(value as TDifficultyPreset)}
          onChange={(_, value) => value && changeDifficulty(getDifficultyFromPreset(value))}
          IconContainerComponent={(props) => (
            <span style={{ marginLeft: props.value > 1 ? '0.2em' : 0 }} {...props}>
              {chordDifficultyIcons[props.value].icon}
            </span>
          )}
        />
        <Typography style={{ marginLeft: '0.5em' }}>
          {chordDifficultyIcons[hoverPreset!]?.label ?? chordDifficultyIcons[difficultyPreset!]?.label ?? 'Własna'}
        </Typography>
      </div>
      {showDescription && (
        <Typography variant="caption" fontStyle="italic" mt="0.5em">
          {getPresetDescription(difficultyPreset, hoverPreset)}
        </Typography>
      )}
    </>
  );
};

export default ChordDifficultyPreset;

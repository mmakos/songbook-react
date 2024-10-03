import StyledRating from '../../components/StyledRating.tsx';
import { IChordDifficulty } from '../../store/songbook.reducer.ts';
import { getDifficultyFromPreset, getDifficultyPreset } from '../../chords/chord-difficulty.tsx';
import { Typography } from '@mui/material';
import {
  SentimentNeutral,
  SentimentSatisfiedSharp,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from '@mui/icons-material';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';

const chordDifficultyIcons: Record<number, { icon: ReactNode, label: string }> = {
  1: {
    icon: <SentimentVeryDissatisfied sx={{color: '#f23591'}} fontSize="inherit" />,
    label: 'Początkujący',
  },
  2: {
    icon: <SentimentNeutral color="error" fontSize="inherit" />,
    label: 'Średnio zaawansowany',
  },
  3: {
    icon: <SentimentSatisfiedSharp color="warning" fontSize="inherit" />,
    label: 'Zaawansowany',
  },
  4: {
    icon: <SentimentVerySatisfied color="success" fontSize="inherit" />,
    label: 'Muzyk zawodowy',
  },
};

interface IChordDifficultyPresetProps {
  chordDifficulty: IChordDifficulty;
  changeDifficulty: (difficulty: IChordDifficulty) => void;
}

const ChordDifficultyPreset: FC<IChordDifficultyPresetProps> = ({ chordDifficulty, changeDifficulty }) => {
  const difficultyPreset = useMemo(() => {
    return getDifficultyPreset(chordDifficulty);
  }, [chordDifficulty]);

  const [hoverPreset, setHoverPreset] = useState(difficultyPreset as number | undefined);

  useEffect(() => {
    setHoverPreset(difficultyPreset ?? undefined);
  }, [difficultyPreset]);

  return (
    <>
      <StyledRating
        size="large"
        max={4}
        highlightSelectedOnly
        value={difficultyPreset}
        onChangeActive={(_, value) => setHoverPreset(value)}
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
    </>
  );
};

export default ChordDifficultyPreset;

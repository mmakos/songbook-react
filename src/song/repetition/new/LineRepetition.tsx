import { FC } from 'react';
import { ILine } from '../../../types/song.types.ts';
import EmptyLine from '../../text/EmptyLine.tsx';

interface ILineRepetitionProps {
  line: ILine;
}

const LineRepetition: FC<ILineRepetitionProps> = ({ line }) => {
  if (!line.repetitionEnd) return <EmptyLine style={{ borderLeft: line.repetition ? 'solid' : undefined }} />;

  return (
    <div style={{ borderLeft: line.repetition ? 'solid' : undefined, paddingLeft: '0.1em' }}>
      x{line.repetitionEnd >= 0 ? line.repetitionEnd : '∞'}
    </div>
  );
};

export default LineRepetition;

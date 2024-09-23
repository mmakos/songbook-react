import { FC, Fragment } from 'react';
import { ILine } from '../../types/song.types.ts';
import ChordSeries from './ChordSeries.tsx';

interface ILineChordsProps {
  line: ILine;
}

const LineChords: FC<ILineChordsProps> = ({ line }) => {
  return (
    <div>
      {line.chords?.chords.map((chordsSeries, i) => (
        <Fragment key={'s' + i}>
          <ChordSeries series={chordsSeries} />
          {i < line.chords?.chords.length - 1 && <>&nbsp;</>}
        </Fragment>
      ))}
    </div>
  );
};

export default LineChords;

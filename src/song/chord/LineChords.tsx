import { FC, Fragment } from 'react';
import { ILine } from '../../types/song.types.ts';
import ChordSeries from './ChordSeries.tsx';
import EmptyLine from '../text/EmptyLine.tsx';
import SilentChordSeries from './SilentChordSeries.tsx';

interface ILineChordsProps {
  line: ILine;
}

const LineChords: FC<ILineChordsProps> = ({ line }) => {
  return (
    <div>
      {line.chords?.chords.map((chordsSeries, i) => (
        <Fragment key={'s' + i}>
          {chordsSeries.silent ? (
            <SilentChordSeries>
              <ChordSeries series={chordsSeries} />
            </SilentChordSeries>
          ) : (
            <ChordSeries series={chordsSeries} />
          )}
          {i < (line.chords?.chords.length ?? 0) - 1 && <>&nbsp;</>}
        </Fragment>
      ))}
      {!line.chords && <EmptyLine />}
    </div>
  );
};

export default LineChords;

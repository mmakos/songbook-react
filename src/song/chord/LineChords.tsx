import { FC, Fragment } from 'react';
import {IChords, ILine} from '../../types/song.types.ts';
import ChordSeries from './ChordSeries.tsx';
import EmptyLine from '../text/EmptyLine.tsx';
import SilentChordSeries from './SilentChordSeries.tsx';

interface ILineChordsProps {
  line: ILine;
  chordsType: keyof IChords;
}

const LineChords: FC<ILineChordsProps> = ({ line, chordsType }) => {
  return (
    <div>
      {line.chords?.[chordsType]?.map((chordsSeries, i) => (
        <Fragment key={'s' + i}>
          {chordsSeries.silent ? (
            <SilentChordSeries>
              <ChordSeries series={chordsSeries} />
            </SilentChordSeries>
          ) : (
            <ChordSeries series={chordsSeries} />
          )}
          {i < (line.chords?.[chordsType]?.length ?? 0) - 1 && <>&nbsp;</>}
        </Fragment>
      ))}
      {!line.chords?.[chordsType] && <EmptyLine />}
    </div>
  );
};

export default LineChords;

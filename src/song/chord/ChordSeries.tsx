import { FC, Fragment } from 'react';
import {IChordSeries} from "../../types/song.types.ts";
import ComplexChord from "./ComplexChord.tsx";

interface IChordSeriesProps {
  series: IChordSeries;
}

const ChordSeries: FC<IChordSeriesProps> = ({series}) => {
  return (
      <>
        {series.chords.map((chord, i) => (
            <Fragment key={'c' + i}>
              <ComplexChord chord={chord}/>
              {i < series.chords.length - 1 && <>&nbsp;</>}
            </Fragment>
        ))}
      </>
  );
};

export default ChordSeries;
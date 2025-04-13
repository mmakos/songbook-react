import { FC, Fragment } from 'react';
import { IChords, IVerse } from '../../types/song.types.ts';
import LineChords from './LineChords.tsx';

interface IVerseChordsProps {
  verse: IVerse;
  chordsType: keyof IChords;
}

const VerseChords: FC<IVerseChordsProps> = ({ verse, chordsType }) => {
  return (
    <>
      {verse.lines.map((line, i) => (
        <Fragment key={'l' + i}>
          <LineChords line={line} chordsType={chordsType} />
        </Fragment>
      ))}
    </>
  );
};

export default VerseChords;

import { FC, Fragment } from 'react';
import { IVerse } from '../../../types/song.types.ts';
import LineRepetition from './LineRepetition.tsx';

interface IVerseRepetitionProps {
  verse: IVerse;
}

const VerseRepetition: FC<IVerseRepetitionProps> = ({ verse }) => {
  return (
    <>
      {verse.lines.map((line, i) => (
        <Fragment key={'l' + i}>
          <LineRepetition line={line} />
        </Fragment>
      ))}
    </>
  );
};

export default VerseRepetition;

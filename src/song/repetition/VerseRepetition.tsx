import { FC, Fragment } from 'react';
import { IVerse } from '../../types/song.types.ts';
import LineRepetition from './LineRepetition.tsx';

interface IVerseRepetitionProps {
  verse: IVerse;
  previousVerse?: IVerse;
  joinWithNextVerse?: boolean;
}

const VerseRepetition: FC<IVerseRepetitionProps> = ({ verse, previousVerse }) => {
  return (
    <>
      {verse.lines.map((line, i) => {
        let previousLine;
        if (i === 0) {
          previousLine = previousVerse && previousVerse.lines[previousVerse.lines.length - 1];
        } else {
          previousLine = verse.lines[i - 1];
        }
        return (
          <Fragment key={'l' + i}>
            <LineRepetition line={line} previousLine={previousLine} last={i === verse.lines.length - 1} first={i === 0} />
          </Fragment>
        );
      })}
    </>
  );
};

export default VerseRepetition;

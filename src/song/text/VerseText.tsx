import { FC, Fragment } from 'react';
import { IVerse } from '../../types/song.types.ts';
import LineText from './LineText.tsx';

interface IVerseTextProps {
  verse: IVerse;
  reference?: boolean;
  verseNumber?: number;
}

const VerseText: FC<IVerseTextProps> = ({ verse, reference, verseNumber }) => {
  return (
    <>
      {verse.lines.map((line, i) => (
        <Fragment key={'l' + i}>
          <LineText line={line} reference={reference} verseNumber={i === 0 ? verseNumber : undefined} />
        </Fragment>
      ))}
    </>
  );
};

export default VerseText;

import { FC, Fragment } from 'react';
import { IVerse } from '../../types/song.types.ts';
import LineText from './LineText.tsx';

interface IVerseTextProps {
  verse: IVerse;
}

const VerseText: FC<IVerseTextProps> = ({ verse }) => {
  return (
    <>
      {verse.lines.map((line, i) => (
        <Fragment key={'l' + i}>
          <LineText line={line} />
        </Fragment>
      ))}
    </>
  );
};

export default VerseText;

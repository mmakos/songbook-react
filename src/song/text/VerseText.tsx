import { FC, Fragment, ReactElement } from 'react';
import { IVerse } from '../../types/song.types.ts';
import LineText from './LineText.tsx';

interface IVerseTextProps {
  verse: IVerse;
  reference?: boolean;
  verseNumber?: number;
}

const VerseText: FC<IVerseTextProps> = ({ verse, reference, verseNumber }) => {
  const lines: ReactElement[] = [];
  let numbered = false;
  verse.lines.forEach((line, i) => {
    const numberLine = !numbered && !!line.text?.length;
    numbered ||= numberLine;
    lines.push(
      <Fragment key={'l' + i}>
        <LineText line={line} reference={reference} verseNumber={numberLine ? verseNumber : undefined} />
      </Fragment>
    );
  });

  return <>{lines}</>;
};

export default VerseText;

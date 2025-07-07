import { FC } from 'react';
import { ILine } from '../../types/song.types.ts';
import useLineHeight from '../../store/useLineHeight.hook.ts';
import useVerseSpacing from '../../store/useVerseSpacing.hook.ts';

interface ILineRepetitionProps {
  line: ILine;
  previousLine?: ILine;
  first?: boolean;
  last?: boolean;
}

const LineRepetition: FC<ILineRepetitionProps> = ({ line, previousLine, first, last }) => {
  const lineHeight = useLineHeight();
  const verseSpace = useVerseSpacing();

  let marginTop;
  let marginBottom;
  let heightEm = lineHeight;

  if ((first || previousLine?.repetitionEnd) && (!previousLine?.repetition || previousLine?.repetitionEnd)) {
    marginTop = (lineHeight - 1) / 2;
    heightEm -= marginTop;
  }
  let height = `${heightEm}em`

  if (last) {
    if (line.repetition && !line.repetitionEnd) {
      height = `calc(${height} + ${verseSpace})`;
    } else {
      height = `calc(${height} - ${(lineHeight - 1) / 2}em)`;
      marginBottom =`calc(${verseSpace} + ${(lineHeight - 1) / 2}em)`;
    }
  } else if (line.repetitionEnd) {
    marginBottom =`${(lineHeight - 1) / 2}em`;
    height = `calc(${height} - ${marginBottom})`;
  }

  return (
    <div
      style={{
        lineHeight: height,
        borderLeft: line.repetition && line.repetitionEnd !== 1 ? 'solid' : undefined,
        paddingLeft: '0.1em',
        marginTop: marginTop && `${marginTop}em`,
        marginBottom: marginBottom,
      }}
    >
      {line.repetition && line.repetitionEnd && line.repetitionEnd !== 1 ? (line.repetitionEnd >= 0 ? 'x' + line.repetitionEnd : 'x∞') : <>&nbsp;</>}
    </div>
  );
};

export default LineRepetition;

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
  let height = lineHeight;

  if ((first || previousLine?.repetitionEnd) && (!previousLine?.repetition || previousLine?.repetitionEnd)) {
    marginTop = (lineHeight - 1) / 2;
    height -= marginTop;
  }
  if (last) {
    if (line.repetition && !line.repetitionEnd) {
      height += verseSpace;
    } else {
      marginBottom = (lineHeight - 1) / 2;
      height -= marginBottom;
      marginBottom += verseSpace;
    }
  } else if (line.repetitionEnd) {
    marginBottom = (lineHeight - 1) / 2;
    height -= marginBottom;
  }

  return (
    <div
      style={{
        height: `${height}em`,
        lineHeight: height,
        borderLeft: line.repetition ? 'solid' : undefined,
        paddingLeft: '0.1em',
        marginTop: marginTop && `${marginTop}em`,
        marginBottom: marginBottom && `${marginBottom}em`,
      }}
    >
      {line.repetitionEnd && (line.repetitionEnd >= 0 ? 'x' + line.repetitionEnd : 'x∞')}
    </div>
  );
};

export default LineRepetition;

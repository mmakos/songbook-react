import { CSSProperties, FC } from 'react';
import { ILine, ITextRun } from '../../types/song.types.ts';

interface ILineTextProps {
  line: ILine;
}

const getRunStyle = (run: ITextRun): CSSProperties => {
  const style: CSSProperties = {};
  if (run.bold) style.fontWeight = 'bold';
  if (run.italic) style.fontStyle = 'italic';
  if (run.underline) style.textDecoration = 'underline';

  return style;
};

const LineText: FC<ILineTextProps> = ({ line }) => {
  return (
    <div>
      {line.text?.map((run, i) => (
        <span key={'r' + i} style={getRunStyle(run)}>
          {run.text}
        </span>
      ))}
    </div>
  );
};

export default LineText;
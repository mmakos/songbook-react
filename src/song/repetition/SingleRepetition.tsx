import { FC } from 'react';
import { IRepetitionSize } from '../../repetition/repetition.ts';
import useLineHeight from '../../store/useLineHeight.hook.ts';
import useVerseSpacing from '../../store/useVerseSpacing.hook.ts';

const SingleRepetition: FC<IRepetitionSize> = ({ lines, verses, repetition, repetitionEnd }) => {
  const lineHeight = useLineHeight();
  const verseSpacing = useVerseSpacing();

  if (!repetition) {
    return (
      <div
        style={{
          height: `${lineHeight * lines + verseSpacing * verses}em`,
        }}
      />
    );
  }

  return (
    <>
      <div style={{ height: `${(lineHeight - 1) / 2}em` }} />
      <div
        style={{
          display: 'flex',
          borderLeft: repetition ? 'solid' : undefined,
          height: `${lineHeight * lines + verseSpacing * verses - lineHeight + 1}em`,
          fontWeight: 'bold',
          paddingLeft: '0.1em',
          alignItems: 'flex-end',
          lineHeight: 1,
        }}
      >
        x{(repetitionEnd ?? 0) > 0 ? repetitionEnd : '∞'}
      </div>
      <div style={{ height: `${(lineHeight - 1) / 2}em` }} />
    </>
  );
};

export default SingleRepetition;

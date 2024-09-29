import { FC, Fragment } from 'react';
import { Collapse } from '@mui/material';
import { useAppSelector } from '../../store/songbook.store.ts';
import { IRepetitionSize } from '../../repetition/repetition.ts';
import SingleRepetition from './SingleRepetition.tsx';
import useLineHeight from '../../store/useLineHeight.hook.ts';
import useVerseSpacing from '../../store/useVerseSpacing.hook.ts';

const CollapsibleSingleRepetition: FC<IRepetitionSize> = ({
  lines,
  verses,
  originalRepetitions,
  repetition,
  repetitionEnd,
}) => {
  const expanded = useAppSelector((state) => state.songDisplayState.expandVerses);
  const lineHeight = useLineHeight();
  const verseSpacing = useVerseSpacing();

  if (!originalRepetitions) {
    return <SingleRepetition lines={lines} verses={verses} repetition={repetition} repetitionEnd={repetitionEnd} />;
  }

  return (
    <Collapse in={expanded} collapsedSize={`${lineHeight + verseSpacing}em`}>
      <>
        {expanded ? (
          originalRepetitions.map((repetition, i) => (
            <Fragment key={'r' + i}>
              <SingleRepetition {...repetition} />
            </Fragment>
          ))
        ) : (
         <SingleRepetition lines={lines} verses={verses} repetition={repetition} repetitionEnd={repetitionEnd} />
        )}
      </>
    </Collapse>
  );
};

export default CollapsibleSingleRepetition;

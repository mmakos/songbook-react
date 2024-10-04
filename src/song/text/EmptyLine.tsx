import useLineHeight from '../../store/useLineHeight.hook.ts';
import { FC, HTMLAttributes } from 'react';

const EmptyLine: FC<HTMLAttributes<HTMLDivElement>> = ({ style }) => {
  const lineHeight = useLineHeight();

  return <div style={{ ...style, height: `${lineHeight}em` }} />;
};

export default EmptyLine;

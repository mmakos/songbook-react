import useLineHeight from '../../store/useLineHeight.hook.ts';
import { FC, HTMLAttributes } from 'react';

interface IEmptyLineProps {
  addHeight?: string;
  edge?: boolean;
}

const EmptyLine: FC<HTMLAttributes<HTMLDivElement> & IEmptyLineProps> = ({ style, addHeight }) => {
  const lineHeight = useLineHeight();

  return <div style={{ ...style, height: addHeight ? `calc(${lineHeight}em + ${addHeight})` : `${lineHeight}em` }} />;
};

export default EmptyLine;

import useLineHeight from '../../store/useLineHeight.hook.ts';

const EmptyLine = () => {
  const lineHeight = useLineHeight();

  return <div style={{ height: `${lineHeight}em` }} />;
};

export default EmptyLine;

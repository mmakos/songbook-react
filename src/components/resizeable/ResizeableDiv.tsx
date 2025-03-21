import { FC, HTMLProps, useCallback, useRef, useState } from 'react';
import ResizeDiv from './ResizeDiv.ts';

interface ResizeableDivProps extends HTMLProps<HTMLDivElement> {
  minWidth: number;
  maxWidth: number;
}

const ResizeableDiv: FC<ResizeableDivProps> = ({ minWidth, maxWidth, children, ...props }) => {
  const [resizing, setResizing] = useState(false);
  const [width, setWidth] = useState<number>();
  const divRef = useRef<HTMLDivElement>(null);
  const topX = useRef<number>();

  const handleMouseDown = () => {
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('mousemove', handleMouseMove, true);
    document.body.style.cursor = 'ew-resize';
    topX.current = divRef.current!.getBoundingClientRect().x;
    setResizing(true);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.body.style.cursor = 'default';
    setResizing(false);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setWidth(Math.min(Math.max(e.clientX - topX.current!, minWidth), maxWidth));
  }, []);

  return (
    <div ref={divRef} {...props} style={{ ...props.style, width, overflow: 'auto', position: 'relative' }}>
      {children}
      <ResizeDiv onMouseDown={handleMouseDown} resizing={resizing} position="right" style={{ position: 'absolute' }} />
    </div>
  );
};

export default ResizeableDiv;

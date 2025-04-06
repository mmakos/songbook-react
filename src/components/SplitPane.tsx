import { FC, ReactNode, useRef, useState } from 'react';
import ResizeDiv from './resizeable/ResizeDiv.ts';

interface ISplitPaneProps {
  left?: ReactNode;
  right?: ReactNode;
  initial?: number;
}

const SplitPane: FC<ISplitPaneProps> = ({ left, right, initial }) => {
  const [dividerPosition, setDividerPosition] = useState(initial ?? 50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    newPosition = Math.max(10, Math.min(90, newPosition));

    setDividerPosition(newPosition);
  };

  const handleMouseDown = () => {
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('mousemove', handleMouseMove, true);
    document.body.style.cursor = 'ew-resize';
    // topX.current = divRef.current!.getBoundingClientRect().x;
    setResizing(true);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.body.style.cursor = 'default';
    setResizing(false);
  };

  return (
    <div ref={containerRef} style={{ display: 'flex', width: '100%', gap: 5 }}>
      {left && right ? <div style={{ width: `${dividerPosition}%` }}>{left}</div> : left}
      {left && right && <ResizeDiv onMouseDown={handleMouseDown} position="left" resizing={resizing} />}
      {right && left ? <div style={{ width: `${100 - dividerPosition}%` }}>{right}</div> : right}
    </div>
  );
};

export default SplitPane;

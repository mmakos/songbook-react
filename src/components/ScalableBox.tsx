import { FC, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Box, BoxProps, useTheme } from '@mui/material';
import { ISong } from '../types/song.types.ts';

const ScalableBox: FC<Omit<BoxProps, 'style'> & { outerBoxRef: RefObject<HTMLDivElement | null>; song: ISong }> = ({
  outerBoxRef,
  song,
  ...props
}) => {
  const theme = useTheme();
  const [scaled, setScaled] = useState(false);
  const innerBoxRef = useRef<HTMLDivElement | null>(null);
  const tapTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setScaled(false);
  }, [song]);

  const [scale, height] = useMemo(() => {
    if (!innerBoxRef.current || !outerBoxRef.current) return [1, undefined];

    const outerBox = outerBoxRef.current!;
    const innerBox = innerBoxRef.current!;

    if (scaled) {
      const scale = outerBox.clientWidth / innerBox.scrollWidth;
      if (scale === 1) return [1, undefined];
      return [scale, outerBox.clientHeight * scale];
    }

    return [1, undefined];
  }, [scaled, outerBoxRef, outerBoxRef.current?.clientWidth]);

  const handleTouchStart = () => {
    const current = tapTimeoutRef.current;
    if (current) {
      clearTimeout(current);
      tapTimeoutRef.current = null;
      setScaled(true);
    } else {
      tapTimeoutRef.current = setTimeout(() => {
        tapTimeoutRef.current = null;
      }, 300);
    }
  };

  return (
    <Box
      {...props}
      ref={innerBoxRef}
      style={{
        height: height,
        transform: `scale(${scale})`,
        transition: theme.transitions.create(['height', 'transform']),
        transformOrigin: 'top left',
        WebkitOverflowScrolling: 'touch',
      }}
      onDoubleClick={() => setScaled(!scaled)}
      onTouchStart={handleTouchStart}
    />
  );
};

export default ScalableBox;

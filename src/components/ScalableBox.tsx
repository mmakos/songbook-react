import { FC, RefObject, useEffect, useMemo, useRef } from 'react';
import { Box, BoxProps, useTheme } from '@mui/material';

export type TScale = 'normal' | 'small' | undefined;

const ScalableBox: FC<
  Omit<BoxProps, 'style'> & {
    outerBoxRef: RefObject<HTMLDivElement | null>;
    zoom: TScale;
    changeZoomPossible: (possible: boolean) => void;
  }
> = ({ outerBoxRef, zoom, changeZoomPossible, ...props }) => {
  const theme = useTheme();
  const innerBoxRef = useRef<HTMLDivElement | null>(null);

  const zoomSet = useRef(false);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const outer = outerBoxRef.current?.clientWidth ?? 100000;
      const inner = innerBoxRef.current?.scrollWidth ?? 0;
      if (outer < inner) {
        if (!zoomSet.current) {
          changeZoomPossible(true);
          zoomSet.current = true;
        }
      } else if (zoomSet.current) {
        changeZoomPossible(false);
        zoomSet.current = false;
      }
    });

    if (outerBoxRef.current) {
      observer.observe(outerBoxRef.current!);
    }

    return () => observer.disconnect();
  }, []);

  const [scale, height] = useMemo(() => {
    if (!innerBoxRef.current || !outerBoxRef.current || zoom !== 'small') return [1, undefined];

    const outerBox = outerBoxRef.current!;
    const innerBox = innerBoxRef.current!;
    const scale = outerBox.clientWidth / innerBox.scrollWidth;
    if (scale === 1) return [1, undefined];
    return [scale, innerBox.clientHeight * scale];
  }, [zoom]);

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
    />
  );
};

export default ScalableBox;

import { FC, Touch, TouchEvent, TouchList, useState } from 'react';
import { Box, BoxProps } from '@mui/material';

const ScalableBox: FC<Omit<BoxProps, 'style'>> = (props) => {
  const [scale, setScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(0);

  const getPinchDistance = (touches: TouchList) => {
    const [touch1, touch2] = touches as unknown as Touch[];
    const dx = touch2.pageX - touch1.pageX;
    const dy = touch2.pageY - touch1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getPinchDistance(e.touches);
      setInitialDistance(distance);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const newDistance = getPinchDistance(e.touches);
      const newScale = newDistance / initialDistance;
      setScale(Math.max(0.5, Math.min(newScale, 3)));
      e.preventDefault();
    }
  };

  return (
    <Box
      {...props}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: '0 0',
        WebkitOverflowScrolling: 'touch',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    />
  );
};

export default ScalableBox;

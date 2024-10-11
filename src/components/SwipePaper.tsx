import { FC, useState } from 'react';
import { Paper, PaperProps, styled } from '@mui/material';

interface ISwipePaperProps {
  onSwipedOut: () => void;
}

const SwipePaper: FC<ISwipePaperProps & PaperProps> = ({ onSwipedOut, ...props }) => {
  const [startX, setStartX] = useState<number>();
  const [translateX, setTranslateX] = useState(0);
  const [scale, setScale] = useState(1);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleMouseStart = (e) => {
    console.log('START');
    setStartX(e.clientX);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;

    if (diffX > 0) {
      setTranslateX(diffX);
      setScale(Math.max(1 - diffX / 300, 0.5));
    }
  };

  const handleMouseMove = (e) => {
    if (startX === undefined) return;
    const currentX = e.clientX;
    const diffX = currentX - startX;

    if (diffX > 0) {
      setTranslateX(diffX);
      setScale(Math.max(1 - diffX / 500, 0.5));
    }
  };

  const handleTouchEnd = () => {
    if (translateX > 150) {
      // setIsGone(true);
    } else {
      setTranslateX(0);
      setScale(1);
    }
  };

  const handleMouseEnd = () => {
    console.log('END');
    if (translateX > 150) {
      // setIsGone(true);
    }
    setTranslateX(0);
    setScale(1);
    setStartX(undefined);
  };

  // Styles for the paper
  const PaperStyled = styled(Paper)(({ theme }) => ({
    transition: 'transform 0.3s ease, scale 0.3s ease',
    transform: `translateX(${translateX}px) scale(${scale})`,
    width: '300px',
    height: '200px',
    padding: theme.spacing(2),
  }));

  return (
    <PaperStyled
      {...props}
      style={{
        ...props.style,
        transition: 'transform 0.3s ease, scale 0.3s ease',
        transform: `translateX(${translateX}px) scale(${scale})`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseStart}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseEnd}
      onMouseUp={handleMouseEnd}
    />
  );
};

export default SwipePaper;

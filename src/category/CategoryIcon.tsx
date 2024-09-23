import { TCategory } from '../types/song.types.ts';
import { FC } from 'react';
import { Church, HistoryEdu } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import PolandFighting from '../components/icon/PolandFighting.tsx';
import FirePlace from '../components/icon/FirePlace.tsx';
import ChristmasCandle from '../components/icon/ChristmasCandle.tsx';

interface ICategoryIconProps {
  category: TCategory;
}

const CategoryIcon: FC<ICategoryIconProps & SvgIconProps> = ({ category, ...props }) => {
  switch (category) {
    case 'common':
      return <FirePlace {...props} />;
    case 'kaczmarski':
      return <HistoryEdu {...props} />;
    case 'religious':
      return <Church {...props} />;
    case 'patriotic':
      return <PolandFighting {...props} />;
    case 'carols':
      return <ChristmasCandle {...props} />;
  }
};

export default CategoryIcon;

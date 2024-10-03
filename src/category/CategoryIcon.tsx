import { Category } from '../types/song.types.ts';
import { FC } from 'react';
import { Church, HistoryEdu } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import PolandFighting from '../components/icon/PolandFighting.tsx';
import FirePlace from '../components/icon/FirePlace.tsx';
import ChristmasCandle from '../components/icon/ChristmasCandle.tsx';

interface ICategoryIconProps {
  category: Category;
}

const CategoryIcon: FC<ICategoryIconProps & SvgIconProps> = ({ category, ...props }) => {
  switch (category) {
    case Category.OTHER:
      return <FirePlace {...props} />;
    case Category.KACZMARSKI:
      return <HistoryEdu {...props} />;
    case Category.RELIGIOUS:
      return <Church {...props} />;
    case Category.PATRIOTIC:
      return <PolandFighting {...props} />;
    case Category.CAROLS:
      return <ChristmasCandle {...props} />;
  }
};

export default CategoryIcon;

import { useState } from 'react';
import MainMenuItem from '../components/MainMenuItem.tsx';
import { Divider } from '@mui/material';
import MainMenuButton from '../components/MainMenuButton.tsx';
import { MusicNote } from '@mui/icons-material';
import CategoryIcon from '../category/CategoryIcon.tsx';
import { Category } from '../types/song.types.ts';
import { getCategoryDisplayName } from '../category/category.utils.ts';

const SongsMenu = () => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const onClose = () => {
    setAnchor(null);
  };

  return (
    <MainMenuButton name="Piosenki" routeTo="/songs" anchor={anchor} setAnchor={setAnchor} icon={<MusicNote />}>
      <MainMenuItem name="Wszystkie" routeTo="/songs" close={onClose} />
      <Divider />
      {Object.values(Category).map((category: Category) => (
        <MainMenuItem
          key={category}
          name={getCategoryDisplayName(category)}
          routeTo={`/songs/${category}`}
          close={onClose}
          icon={<CategoryIcon category={category} />}
        />
      ))}
    </MainMenuButton>
  );
};

export default SongsMenu;

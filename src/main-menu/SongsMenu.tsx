import { useState } from 'react';
import MainMenuItem from '../components/MainMenuItem.tsx';
import { Divider } from '@mui/material';
import MainMenuButton from '../components/MainMenuButton.tsx';
import { MusicNote } from '@mui/icons-material';
import CategoryIcon from '../category/CategoryIcon.tsx';

const SongsMenu = () => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const onClose = () => {
    setAnchor(null);
  };

  return (
    <MainMenuButton name="Piosenki" routeTo="/songs" anchor={anchor} setAnchor={setAnchor} icon={<MusicNote />}>
      <MainMenuItem name="Wszystkie" routeTo="/songs" close={onClose} />
      <Divider />
      <MainMenuItem name="Kaczmarski" routeTo="/songs/kaczmarski" close={onClose} icon={<CategoryIcon category='kaczmarski'/>} />
      <MainMenuItem name="Obozowe" routeTo="/songs/common" close={onClose} icon={<CategoryIcon category='common'/>} />
      <MainMenuItem name="Religijne" routeTo="/songs/religious" close={onClose} icon={<CategoryIcon category='religious'/>} />
      <MainMenuItem name="Patriotyczne" routeTo="/songs/patriotic" close={onClose} icon={<CategoryIcon category='patriotic'/>} />
      <MainMenuItem name="Kolędy" routeTo="/songs/carols" close={onClose} icon={<CategoryIcon category='carols'/>} />
    </MainMenuButton>
  );
};

export default SongsMenu;

import { useState } from 'react';
import MainMenuItem from '../components/MainMenuItem.tsx';
import MainMenuButton from '../components/MainMenuButton.tsx';
import { EmojiEmotions } from '@mui/icons-material';

const ExtrasMenu = () => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const onClose = () => {
    setAnchor(null);
  };

  return (
    <MainMenuButton name="Dodatki" routeTo="/extras" anchor={anchor} setAnchor={setAnchor} icon={<EmojiEmotions />}>
      <MainMenuItem name="Jak korzystać" routeTo="/extras/usage" close={onClose} />
      <MainMenuItem name="Nuty" href="https://mmakos.pl/music/my-arrangments" close={onClose} />
      <MainMenuItem name="Tabulatury" routeTo="/extras/tabs" close={onClose} />
      <MainMenuItem name="Tłumaczenia" routeTo="/extras/translations" close={onClose} />
      <MainMenuItem
        name="Śpiewnik papierowy"
        href="https://www.mmakos.pl/music/songbooks/my-songbook/"
        close={onClose}
      />
    </MainMenuButton>
  );
};

export default ExtrasMenu;

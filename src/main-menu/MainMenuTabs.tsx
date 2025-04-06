import MainMenuGroup from './group/MainMenuGroup.tsx';
import { FC, useState } from 'react';
import MainMenuItem, { TMenuType } from './item/MainMenuItem.tsx';
import { EmojiEmotions, Home, MusicNote } from '@mui/icons-material';
import MainMenuSubItem from './item/MainMenuSubItem.tsx';
import { Divider } from '@mui/material';
import { Category } from '../types/song.types.ts';
import { getCategoryDisplayName } from '../category/category.utils.ts';
import CategoryIcon from '../category/CategoryIcon.tsx';
import UserMenu from "../user/UserMenu.tsx";
import useCanEdit from "../store/useCanEdit.hook.ts";

interface IMainMenuTabsProps {
  type: TMenuType;
  close: () => void;
}

const MainMenuTabs: FC<IMainMenuTabsProps> = ({ type, close }) => {
  const [songsExpanded, setSongsExpanded] = useState(false);
  const [extrasExpanded, setExtrasExpanded] = useState(false);
  const {canVerify} = useCanEdit();

  const handleSongsClose = () => {
    close();
    setSongsExpanded(false);
  };

  const handleExtrasClose = () => {
    close();
    setSongsExpanded(false);
  };

  return (
    <>
      <MainMenuItem type={type} routeTo="/" text={'Strona główna'} icon={<Home />} close={close} />
      <MainMenuGroup
        type={type}
        text="Piosenki"
        icon={<MusicNote />}
        expanded={songsExpanded}
        setExpanded={setSongsExpanded}
      >
        <MainMenuSubItem type={type} text="Wszystkie" routeTo="/songs" close={handleSongsClose} />
        {canVerify && <MainMenuSubItem type={type} text="Poczekalnia" routeTo="/songs/?w=1" close={handleSongsClose} />}
        <Divider variant="middle" />
        {Object.values(Category).map((category: Category) => (
          <MainMenuSubItem
            type={type}
            key={category}
            text={getCategoryDisplayName(category)}
            routeTo={`/songs/${category}`}
            close={handleSongsClose}
            icon={<CategoryIcon category={category} />}
          />
        ))}
      </MainMenuGroup>
      <MainMenuGroup
        type={type}
        text="Dodatki"
        icon={<EmojiEmotions />}
        expanded={extrasExpanded}
        setExpanded={setExtrasExpanded}
      >
        <MainMenuSubItem
          type={type}
          text="Jak korzystać"
          href="https://spiewnik.mmakos.pl/dodatki/jak-korzystac/"
          close={handleExtrasClose}
        />
        <MainMenuSubItem
          type={type}
          text="Nuty"
          href="https://mmakos.pl/music/my-arrangements"
          close={handleExtrasClose}
        />
        <MainMenuSubItem
          type={type}
          text="Tabulatury"
          href="https://spiewnik.mmakos.pl/dodatki/tabulatury/"
          close={handleExtrasClose}
        />
        <MainMenuSubItem
          type={type}
          text="Tłumaczenia"
          href="https://spiewnik.mmakos.pl/dodatki/tlumaczenia/"
          close={handleExtrasClose}
        />
        <MainMenuSubItem
          type={type}
          text="Śpiewnik papierowy"
          href="https://mmakos.pl/spiewnik"
          close={handleExtrasClose}
        />
      </MainMenuGroup>
      <UserMenu type={type} close={close}/>
    </>
  );
};

export default MainMenuTabs;

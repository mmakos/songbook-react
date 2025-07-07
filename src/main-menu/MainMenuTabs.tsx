import MainMenuGroup from './group/MainMenuGroup.tsx';
import { FC, useState } from 'react';
import MainMenuItem, { TMenuType } from './item/MainMenuItem.tsx';
import {
  Add,
  CasinoOutlined,
  EmojiEmotions,
  FitnessCenter,
  Groups,
  Home,
  HourglassBottom,
  LibraryMusic,
} from '@mui/icons-material';
import MainMenuSubItem from './item/MainMenuSubItem.tsx';
import { Divider } from '@mui/material';
import { Category } from '../types/song.types.ts';
import { getCategoryDisplayName } from '../category/category.utils.ts';
import CategoryIcon from '../category/CategoryIcon.tsx';
import UserMenu from '../user/UserMenu.tsx';
import useCanEdit from '../store/useCanEdit.hook.ts';
import useRandomSong from '../store/useRandomSong.hook.ts';

interface IMainMenuTabsProps {
  type: TMenuType;
  close: () => void;
}

const MainMenuTabs: FC<IMainMenuTabsProps> = ({ type, close }) => {
  const [songsExpanded, setSongsExpanded] = useState(false);
  const [meetingsExpanded, setMeetingsExpanded] = useState(false);
  const [extrasExpanded, setExtrasExpanded] = useState(false);
  const drawSong = useRandomSong();
  const { canVerify, canEdit } = useCanEdit();

  const handleSongsClose = () => {
    close();
    setSongsExpanded(false);
  };

  const handleExtrasClose = () => {
    close();
    setSongsExpanded(false);
  };

  const handleMeetingsClose = () => {
    close();
    setMeetingsExpanded(false);
  };

  return (
    <>
      <MainMenuItem type={type} routeTo="/" text={'Strona główna'} icon={<Home />} close={close} />
      <MainMenuGroup
        type={type}
        text="Piosenki"
        icon={<LibraryMusic />}
        expanded={songsExpanded}
        setExpanded={setSongsExpanded}
      >
        <MainMenuSubItem type={type} text="Wszystkie" routeTo="/songs" close={handleSongsClose} inset />
        {canVerify && (
          <MainMenuSubItem
            type={type}
            text="Poczekalnia"
            routeTo="/songs/?w=1"
            close={handleSongsClose}
            icon={<HourglassBottom />}
          />
        )}
        <MainMenuSubItem
          type={type}
          text="Losowa piosenka"
          onClick={drawSong}
          close={handleSongsClose}
          icon={<CasinoOutlined />}
        />
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
        {canEdit && (
          <>
            <Divider variant="middle" />
            <MainMenuSubItem
              type={type}
              text="Dodaj nową"
              routeTo="/add/song"
              close={handleSongsClose}
              icon={<Add />}
            />
          </>
        )}
      </MainMenuGroup>
      <MainMenuGroup
        type={type}
        text="Śpiewanki"
        icon={<Groups />}
        expanded={meetingsExpanded}
        setExpanded={setMeetingsExpanded}
      >
        {canEdit && (
          <MainMenuSubItem type={type} text="Moje śpiewanki" routeTo="/meetings" close={handleMeetingsClose} />
        )}
        <MainMenuSubItem type={type} text="Obecne śpiewanki" routeTo="/meeting" close={handleMeetingsClose} />
        {canEdit && (
          <>
            <Divider variant="middle" />
            <MainMenuSubItem type={type} text="Utwórz śpiewanki" routeTo="/add/meeting" close={handleMeetingsClose} />
          </>
        )}
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
          href="https://spiewnik0.mmakos.pl/dodatki/jak-korzystac/"
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
          href="https://spiewnik0.mmakos.pl/dodatki/tabulatury/"
          close={handleExtrasClose}
        />
        <MainMenuSubItem
          type={type}
          text="Tłumaczenia"
          href="https://spiewnik0.mmakos.pl/dodatki/tlumaczenia/"
          close={handleExtrasClose}
        />
        <MainMenuSubItem
          type={type}
          text="Śpiewnik papierowy"
          href="https://mmakos.pl/spiewnik"
          close={handleExtrasClose}
        />
        <Divider variant="middle" />
        <MainMenuSubItem
          type={type}
          text="Kalkulator siły"
          icon={<FitnessCenter />}
          routeTo="/strength"
          close={handleSongsClose}
        />
      </MainMenuGroup>
      <UserMenu type={type} close={close} />
    </>
  );
};

export default MainMenuTabs;

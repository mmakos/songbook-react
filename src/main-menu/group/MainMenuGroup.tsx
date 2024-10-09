import { FC, PropsWithChildren, ReactNode } from 'react';
import { TMenuType } from './../item/MainMenuItem.tsx';
import MainMenuDrawerGroup from './MainMenuDrawerGroup.tsx';
import MainMenuAppBarGroup from './MainMenuAppBarGroup.tsx';

export interface IMainMenuGroupProps extends PropsWithChildren {
  type: TMenuType;
  text: ReactNode;
  icon: ReactNode;
  expanded?: boolean;
  setExpanded: (expanded: boolean) => void;
}

const MainMenuGroup: FC<IMainMenuGroupProps> = ({ type, icon, text, expanded, setExpanded, children }) => {
  if (type === 'drawer') {
    return (
      <MainMenuDrawerGroup text={text} icon={icon} expanded={expanded} setExpanded={setExpanded}>
        {children}
      </MainMenuDrawerGroup>
    );
  } else {
    return (
      <MainMenuAppBarGroup text={text} icon={icon} expanded={expanded} setExpanded={setExpanded}>
        {children}
      </MainMenuAppBarGroup>
    );
  }
};

export default MainMenuGroup;

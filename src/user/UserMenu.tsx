import { useAppSelector } from '../store/songbook.store.ts';
import MainMenuItem, { IMainMenuItemProps } from '../main-menu/item/MainMenuItem.tsx';
import { FC } from 'react';
import VerifiedUserIcon from '../components/icon/VerifiedUserIcon.tsx';

const UserMenu: FC<Omit<IMainMenuItemProps, 'text'>> = ({ close, type }) => {
  const user = useAppSelector((state) => state.user);

  if (user === undefined) return;

  return (
    <MainMenuItem
      type={type}
      text={user ? 'Konto' : 'Zaloguj'}
      close={close}
      routeTo={user ? '/account' : '/login'}
      icon={<VerifiedUserIcon userType={user?.type} neutral fontSize="inherit" />}
    />
  );
};

export default UserMenu;

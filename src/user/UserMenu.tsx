import { useAppSelector } from '../store/songbook.store.ts';
import MainMenuItem, { IMainMenuItemProps } from '../main-menu/item/MainMenuItem.tsx';
import { FC } from 'react';
import { Person } from '@mui/icons-material';

const UserMenu: FC<Omit<IMainMenuItemProps, 'text'>> = ({ close, type }) => {
  const user = useAppSelector((state) => state.user);

  if (user === undefined) return;

  return (
    <MainMenuItem
      type={type}
      text={user ? 'Konto' : 'Zaloguj'}
      close={close}
      routeTo={user ? '/account' : '/login'}
      icon={<Person />}
    />
  );
};

export default UserMenu;

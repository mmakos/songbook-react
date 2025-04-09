import { useAppSelector } from './songbook.store.ts';
import { UserType } from '../user/user.types.ts';

const useCanEdit = () => {
  const user = useAppSelector((state) => state.user);
  return {
    canEdit: !!user,
    canRemove: !!user?.type,
    canVerify: user?.type === UserType.JEDI || user?.type === UserType.SITH,
  };
};

export default useCanEdit;

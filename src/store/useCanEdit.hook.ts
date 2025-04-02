import { useAppSelector } from './songbook.store.ts';

const useCanEdit = (): boolean => {
  const user = useAppSelector((state) => state.user);
  return !!user;
};

export default useCanEdit;

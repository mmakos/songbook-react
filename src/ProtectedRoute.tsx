import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './store/songbook.store.ts';
import { UserType } from './user/user.types.ts';

const ProtectedRoute = ({ types }: { types?: UserType[] }) => {
  const user = useAppSelector((state) => state.user);
  if (user === undefined) return;

  if ((user && !types) || (user?.type && types.includes(user.type))) return <Outlet />;
  return <Navigate to="/login" />;
};

export default ProtectedRoute;

import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './store/songbook.store.ts';

const ProtectedRoute = () => {
  const user = useAppSelector((state) => state.user);
  if (user === undefined) return;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
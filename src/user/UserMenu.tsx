import { useAppSelector } from '../store/songbook.store.ts';
import { Avatar, IconButton } from '@mui/material';
import { useNavigate } from 'react-router';

const UserMenu = () => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  return user ? (
    <Avatar />
  ) : (
    <IconButton sx={{ padding: 0 }} onClick={() => navigate('/login')}>
      <Avatar />
    </IconButton>
  );
};

export default UserMenu;

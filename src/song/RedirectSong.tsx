import { Navigate, useParams } from 'react-router-dom';

const RedirectSong = () => {
  const { title } = useParams();
  return <Navigate to={`/song/${title}`} replace />;
};

export default RedirectSong;

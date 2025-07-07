import { Route } from 'react-router';
import Strength from './Strength.tsx';

const StrengthRoutes = () => {
  return (
    <>
      <Route path={'/strength'} element={<Strength />} />
    </>
  );
};

export default StrengthRoutes;

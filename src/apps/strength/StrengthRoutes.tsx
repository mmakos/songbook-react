import { Route } from 'react-router';
import { lazy } from 'react';

// To nie ma nic wspólnego ze śpiewnikiem (zewnętrzna apka)
const Strength = lazy(() => import('./Strength.tsx'));

const StrengthRoutes = () => {
  return (
    <>
      <Route path={'/strength'} element={<Strength />} />
    </>
  );
};

export default StrengthRoutes;

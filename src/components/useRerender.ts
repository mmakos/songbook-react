import { useState } from 'react';

const useRerender = () => {
  const [flag, setFlag] = useState(false);

  return () => setFlag(!flag);
};

export default useRerender;

import { GlobalSongContextProvider } from './SongContext.tsx';
import SongContent, { ISongContentProps } from './SongContent.tsx';
import { FC } from 'react';

const GlobalSongContent: FC<ISongContentProps> = (props) => {
  return (
    <GlobalSongContextProvider>
      <SongContent {...props} />
    </GlobalSongContextProvider>
  );
};

export default GlobalSongContent;

import { useAppSelector } from '../../store/songbook.store.ts';
import { FC, PropsWithChildren } from 'react';

const SilentChordSeries: FC<PropsWithChildren> = ({ children }) => {
  const silentStyle = useAppSelector((state) => state.songbookSettings.songTheme.fontStyles.silentChords);

  return (
    <span
      style={{
        fontWeight: silentStyle.bold ? 'bold' : 'normal',
        fontStyle: silentStyle.italic ? 'italic' : 'normal',
        textDecoration: silentStyle.underline ? 'underline' : 'none',
      }}
    >
      {children}
    </span>
  );
};

export default SilentChordSeries;

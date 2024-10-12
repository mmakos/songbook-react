import { forwardRef } from 'react';
import { SourceType } from '../types/song.types.ts';
import { Movie, Radio, Speaker, SportsEsports, TheaterComedy } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

interface ISourceTypeIconProps extends SvgIconProps {
  type: SourceType;
}

const SourceTypeIcon = forwardRef<SVGSVGElement, ISourceTypeIconProps>(
  ({ type, ...props }, _ref) => {
    switch (type) {
      case SourceType.MOVIE:
        return <Movie {...props} ref={_ref} />;
      case SourceType.GAME:
        return <SportsEsports {...props} ref={_ref} />;
      case SourceType.PLAY:
        return <Radio {...props} ref={_ref} />;
      case SourceType.MUSICAL:
        return <TheaterComedy {...props} ref={_ref} />;
      case SourceType.SOUNDTRACK:
        return <Speaker {...props} ref={_ref} />;
    }
  }
);

export default SourceTypeIcon;

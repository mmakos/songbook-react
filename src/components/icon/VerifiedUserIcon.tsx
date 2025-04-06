import { FC } from 'react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { SvgIconProps } from '@mui/material';
import DarthVader from './DarthVader.tsx';
import R2D2 from './R2D2.tsx';
import JediOrder from './JediOrder.tsx';
import { Person } from '@mui/icons-material';
import { UserType } from '../../user/user.types.ts';

const VerifiedUser: FC<SvgIconProps & { userType?: UserType; neutral?: boolean }> = ({
  userType,
  neutral,
  ...props
}) => {
  if (!userType) return neutral ? <Person {...props} /> : undefined;

  switch (userType) {
    case UserType.SITH:
      return <DarthVader {...props} />;
    case UserType.JEDI:
      return <JediOrder {...props} />;
    case UserType.DROID:
      return <R2D2 {...props} />;
    case UserType.CLONE:
      return <VerifiedUserIcon {...props} />;
  }
};

export default VerifiedUser;

import { FC } from 'react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { SvgIconProps } from '@mui/material';
import BasicTooltip from '../components/BasicTooltip.tsx';
import DarthVader from '../components/icon/DarthVader.tsx';
import R2D2 from '../components/icon/R2D2.tsx';
import { UserType } from '../types/song.types.ts';

const VerifiedUser: FC<SvgIconProps & { userType?: UserType }> = ({ userType, ...props }) => {
  if (!userType) return;

  switch (userType) {
    case UserType.OWNER:
      return (
        <BasicTooltip title="Darth Vader, właściciel i twórca (dla znajomych Makoś)">
          <DarthVader {...props} />
        </BasicTooltip>
      );
    case UserType.BOT:
      return (
        <BasicTooltip title="RD2D - bot">
          <R2D2 {...props} />
        </BasicTooltip>
      );
    case UserType.VERIFIED:
      return (
        <BasicTooltip title="Zweryfikowany użytkownik">
          <VerifiedUserIcon {...props} />
        </BasicTooltip>
      );
  }
};

export default VerifiedUser;

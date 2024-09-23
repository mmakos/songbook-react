import { FC } from 'react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { isBoss, isBot } from './user.utils.ts';
import { SvgIconProps } from '@mui/material';
import BasicTooltip from '../components/BasicTooltip.tsx';
import DarthVader from '../components/icon/DarthVader.tsx';
import R2D2 from '../components/icon/R2D2.tsx';

const VerifiedUser: FC<SvgIconProps & { userId: string }> = ({ userId, ...props }) => {
  if (isBoss(userId)) {
    return (
      <BasicTooltip title="Darth Vader, właściciel i twórca (dla znajomych Makoś)">
        <DarthVader {...props} />
      </BasicTooltip>
    );
  } else if (isBot(userId)) {
    return (
      <BasicTooltip title="RD2D - bot">
        <R2D2 {...props} />
      </BasicTooltip>
    );
  }
  return (
    <BasicTooltip title="Zweryfikowany użytkownik">
      <VerifiedUserIcon {...props} />
    </BasicTooltip>
  );
};

export default VerifiedUser;

import { Attributes, FC } from 'react';
import { TooltipProps } from '@mui/material';
import BasicTooltip from '../components/BasicTooltip.tsx';
import { UserType } from './user.types.ts';

const VerifiedUserTooltip: FC<Omit<TooltipProps, 'title'> & Attributes & { userType?: UserType }> = ({
  userType,
  ...props
}) => {
  if (!userType) return;

  switch (userType) {
    case UserType.SITH:
      return <BasicTooltip {...props} title="Sith Lord (a dokładnie Darth Vader) - właściciel i stwórca" />;
    case UserType.JEDI:
      return <BasicTooltip {...props} title="Rycerz Jedi - moderator" />;
    case UserType.DROID:
      return <BasicTooltip {...props} title="Droid (dokładnie RD2D) - bot" />;
    case UserType.CLONE:
      return <BasicTooltip {...props} title="Klon armii republiki - zweryfikowany użytkownik" />;
  }
};

export default VerifiedUserTooltip;

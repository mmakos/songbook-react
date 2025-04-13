import { Attributes, FC } from 'react';
import { TooltipProps } from '@mui/material';
import BasicTooltip from '../components/BasicTooltip.tsx';
import { UserType } from './user.types.ts';

const VerifiedUserTooltip: FC<Omit<TooltipProps, 'title'> & Attributes & { userType?: UserType }> = ({
  userType,
    children,
  ...props
}) => {
  if (!userType) return;

  switch (userType) {
    case UserType.SITH:
      return <BasicTooltip {...props} span title="Sith Lord (a dokładnie Darth Vader) - właściciel i stwórca">{children}</BasicTooltip>;
    case UserType.JEDI:
      return <BasicTooltip {...props} span title="Rycerz Jedi - moderator">{children}</BasicTooltip>;
    case UserType.DROID:
      return <BasicTooltip {...props} span title="Droid (dokładnie RD2D) - bot">{children}</BasicTooltip>;
    case UserType.CLONE:
      return <BasicTooltip {...props} span title="Klon armii republiki - zweryfikowany użytkownik">{children}</BasicTooltip>;
  }
};

export default VerifiedUserTooltip;

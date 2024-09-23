import { Verified } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { FC } from 'react';
import { IEditorInfo } from '../types/song.types.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';
import { isBoss } from '../user/user.utils.ts';
import VerifiedUser from '../user/VerifiedUser.tsx';

interface IEditorInfoProps {
  prefix: string;
  editorInfo: IEditorInfo;
}

const EditorInfo: FC<IEditorInfoProps> = ({ prefix, editorInfo }) => {
  return (
    <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
      {editorInfo.verified && (
        <BasicTooltip title="Zweryfikowano">
          <Verified color="success" sx={{ mr: '0.3em' }} fontSize="inherit" />
        </BasicTooltip>
      )}
      {prefix} {new Date(editorInfo.time * 1000).toLocaleDateString()} przez&nbsp;
      {editorInfo.userVerified && (
        <VerifiedUser userId={editorInfo.name} color="success" sx={{ mr: '0.3em' }} fontSize="inherit" />
      )}
      {editorInfo.name}
    </Typography>
  );
};

export default EditorInfo;

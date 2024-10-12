import { Verified } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { FC } from 'react';
import { IEditorInfo } from '../types/song.types.ts';
import BasicTooltip from '../components/BasicTooltip.tsx';
import UserIcon from '../user/VerifiedUser.tsx';

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
      <UserIcon userType={editorInfo.type} color="success" sx={{ mr: '0.3em' }} fontSize="inherit" />
      {editorInfo.name}
    </Typography>
  );
};

export default EditorInfo;

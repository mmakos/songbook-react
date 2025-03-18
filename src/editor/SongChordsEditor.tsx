import { useEditor } from '@tiptap/react';
import { Bold } from '@tiptap/extension-bold';
import { Text } from '@tiptap/extension-text';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { HardBreak } from '@tiptap/extension-hard-break';
import { History } from '@tiptap/extension-history';
import StyledEditorContent from './StyledEditorContent.ts';
import DoubleHardWrapToParagraph from './AutoParExtension.ts';
import { FC } from 'react';
import { Italic } from '@tiptap/extension-italic';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Strike } from '@tiptap/extension-strike';

interface ISongChordsEditorProps {
  chords: string;
}

const SongChordsEditor: FC<ISongChordsEditorProps> = ({ chords }) => {
  const editor = useEditor({
    extensions: [
      Text,
      Paragraph,
      HardBreak,
      Document,
      Bold,
      Italic,
      Subscript,
      Superscript,
      Strike,
      History,
      DoubleHardWrapToParagraph,
    ],
    content: chords,
  });

  return <StyledEditorContent editor={editor} />;
};

export default SongChordsEditor;

import { useEditor } from '@tiptap/react';
import { Bold } from '@tiptap/extension-bold';
import { Text } from '@tiptap/extension-text';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { HardBreak } from '@tiptap/extension-hard-break';
import { History } from '@tiptap/extension-history';
import StyledEditorContent from './StyledEditorContent.ts';
import Indent from './IndentExtension.ts';
import TextReplacer from './TextReplacer.ts';
import DoubleHardWrapToParagraph from './AutoParExtension.ts';
import { FC } from 'react';
import {Italic} from "@tiptap/extension-italic";
import {Underline} from "@tiptap/extension-underline";

interface ISongTextEditorProps {
  text: string;
}

const SongTextEditor: FC<ISongTextEditorProps> = ({ text }) => {
  const editor = useEditor({
    extensions: [
      Text,
      Paragraph,
      HardBreak,
      Document,
      Bold,
      Italic,
      Underline,
      History,
      DoubleHardWrapToParagraph,
      TextReplacer,
      Indent.configure({
        types: ['paragraph'],
        minLevel: 0,
        maxLevel: 3,
      }),
    ],
    content: text,
  });

  return <StyledEditorContent editor={editor} />;
};

export default SongTextEditor;

import { Editor } from 'slate';

import { TextFormat } from '../components/editor/Leaf';

export const isMarkActive = (editor: Editor, format: TextFormat): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: Editor, format: TextFormat): void => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

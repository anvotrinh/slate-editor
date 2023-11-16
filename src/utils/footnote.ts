import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { countElementsByType } from './block';
import { FootnoteElement, SupElement } from '../components/editor/footnote';
import { getEditorLastAndEmptyParagraph } from './editor';

export const insertFootnote = (editor: Editor): void => {
  // insert sup
  const footnoteIndex = countElementsByType(editor, 'sup') + 1;
  const supElement: SupElement = {
    type: 'sup',
    index: footnoteIndex,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, supElement);
  // get last and empty paragraph, will remove it later
  // to remove the gap after insert footnote at the end
  const lastAndEmptyParagraph = getEditorLastAndEmptyParagraph(editor);
  // insert footnote
  const footnoteElement: FootnoteElement = {
    type: 'footnote',
    index: footnoteIndex,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, footnoteElement, {
    at: [editor.children.length],
  });
  // remove the gap
  if (lastAndEmptyParagraph) {
    const path = ReactEditor.findPath(editor, lastAndEmptyParagraph);
    Transforms.removeNodes(editor, { at: path });
  }
  // move cursor to the footnote
  Transforms.select(editor, Editor.end(editor, []));
  Transforms.move(editor, { reverse: true });
};

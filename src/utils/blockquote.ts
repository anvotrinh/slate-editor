import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { BlockQuoteElement } from '../components/editor/blockquote';

export const setBlockQuote = (
  editor: Editor,
  element: BlockQuoteElement,
  caption: string,
  url: string
): void => {
  const path = ReactEditor.findPath(editor, element);
  const newProperties: Partial<BlockQuoteElement> = {
    caption,
    url,
  };
  Transforms.setNodes(editor, newProperties, { at: path });
};

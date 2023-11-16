import { Editor, Node, NodeEntry, Transforms } from 'slate';

import { isListItemText } from './common';

// "list-item-text" can only contain text and inline, if child is other type, unwrap it
export const normalizeListItemText = (
  editor: Editor,
  [node, path]: NodeEntry<Node>
): boolean => {
  if (!isListItemText(editor, node)) return false;

  for (const [childNode, childPath] of Node.children(editor, path)) {
    if (Editor.isBlock(editor, childNode)) {
      Transforms.unwrapNodes(editor, { at: childPath });
      return true;
    }
  }
  return false;
};

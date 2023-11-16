import { Editor, Transforms, Node, NodeEntry } from 'slate';

import { isListItem, isListItemText } from './common';

// If "list-item-text" has no "list-item" parent, set it's type to "p"
export const normalizeOrphanListItemText = (
  editor: Editor,
  [node, path]: NodeEntry<Node>
): boolean => {
  if (!isListItemText(editor, node)) return false;

  const parentList = Node.parent(editor, path);
  if (isListItem(editor, parentList)) return false;

  Transforms.setNodes(editor, { type: 'paragraph' }, { at: path });
  return true;
};

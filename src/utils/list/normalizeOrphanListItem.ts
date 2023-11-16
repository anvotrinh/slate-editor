import { Editor, Transforms, Node, NodeEntry } from 'slate';

import { isList, isListItem } from './common';

// If "list-item" has no "list" parent, unwrap it
export const normalizeOrphanListItem = (
  editor: Editor,
  [node, path]: NodeEntry<Node>
): boolean => {
  if (!isListItem(editor, node)) return false;

  const parentList = Node.parent(editor, path);
  if (isList(editor, parentList)) return false;

  Transforms.unwrapNodes(editor, { at: path });
  return true;
};

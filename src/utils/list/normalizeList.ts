import { Editor, Node, NodeEntry, Transforms } from 'slate';
import { isList, isListItem, getEmptyListItem } from './common';

// "list" can only contain "list-item", if child is other type, wrap it with "list-item"
export const normalizeList = (
  editor: Editor,
  [node, path]: NodeEntry<Node>
): boolean => {
  if (!isList(editor, node)) return false;

  for (const [childNode, childPath] of Node.children(editor, path)) {
    if (!isListItem(editor, childNode)) {
      Transforms.wrapNodes(editor, getEmptyListItem(), { at: childPath });
      return true;
    }
  }
  return false;
};

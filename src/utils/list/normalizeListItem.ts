import { Editor, Node, NodeEntry, Text, Transforms } from 'slate';

import {
  isList,
  isListItem,
  isListItemText,
  getEmptyListItem,
  getEmptyListItemText,
} from './common';

export const normalizeListItem = (
  editor: Editor,
  [node, path]: NodeEntry<Node>
): boolean => {
  if (!isListItem(editor, node)) return false;

  const children = Array.from(Node.children(editor, path));
  // if "list-item" is empty, remove it
  if (children.length === 0) {
    Transforms.removeNodes(editor, { at: path });
    return true;
  }

  const [listTextChildNode, listTextChildPath] = children[0];
  if (!isListItemText(editor, listTextChildNode)) {
    // if first child must be "list-item-text" so insert new "list-item-text"
    // after insert, all inline/text child will be removed by slate normalization
    // so we have to wrap all inline/text with "list-item-text", which will later
    // move to text node or UL node
    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(editor, getEmptyListItemText(), {
        at: path.concat(0),
      });
      for (const [childNode, childPath] of Node.children(editor, path)) {
        if (Text.isText(childNode) || Editor.isInline(editor, childNode)) {
          Transforms.wrapNodes(editor, getEmptyListItemText(), {
            at: childPath,
          });
        }
      }
    });
    return true;
  }

  // if "list-item" only have "list-item-text" then it's ok
  if (children.length === 1) return false;

  const [listChildNode, listChildPath] = children[1];

  // if 2nd child is not list, move that child to the "list-item-text"
  if (!isList(editor, listChildNode)) {
    Transforms.moveNodes(editor, {
      at: listChildPath,
      to: listTextChildPath.concat(listTextChildNode.children.length),
    });
    return true;
  }

  // if 1st child is "list-item-text" and 2nd is "list" then it's ok
  if (children.length === 2) return false;

  const [remainChildNode, remainChildPath] = children[2];

  // if remain child is "list", move it to 2nd child "list" and unwrap it
  if (isList(editor, remainChildNode)) {
    Editor.withoutNormalizing(editor, () => {
      const movedListPath = listChildPath.concat(listChildNode.children.length);
      Transforms.moveNodes(editor, { at: remainChildPath, to: movedListPath });
      Transforms.unwrapNodes(editor, { at: movedListPath });
    });
    return true;
  }
  // if remain child is "list-item", move it to 2nd child "list"
  if (isListItem(editor, remainChildNode)) {
    Transforms.moveNodes(editor, {
      at: remainChildPath,
      to: listChildPath.concat(listChildNode.children.length),
    });
    return true;
  }
  // if other type, move it to 2nd child "list", wrap it with new "list-item"
  Editor.withoutNormalizing(editor, () => {
    const movedListPath = listChildPath.concat(listChildNode.children.length);
    Transforms.moveNodes(editor, { at: remainChildPath, to: movedListPath });
    Transforms.wrapNodes(editor, getEmptyListItem(), { at: movedListPath });
  });
  return true;
};

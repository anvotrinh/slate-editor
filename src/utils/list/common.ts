import { Editor, Node, NodeEntry } from 'slate';
import { ReactEditor } from 'slate-react';

import {
  ListElement,
  ListItemElement,
  ListItemTextElement,
} from '../../components/editor/list';

export const getDepthOfList = (editor: Editor, list: ListElement): number => {
  const path = ReactEditor.findPath(editor, list);
  let depth = 1;
  for (const [ancestorNode] of Node.ancestors(editor, path)) {
    if (isList(editor, ancestorNode)) depth++;
  }
  return depth;
};

export const getDepthOfListItem = (
  editor: Editor,
  listItem: ListItemElement
): number => {
  const parentList = getParentList(editor, listItem);
  if (!parentList) return 0;
  return getDepthOfList(editor, parentList[0]);
};

export const getSelectionLowestListItem = (
  editor: Editor
): NodeEntry<ListItemElement> | null => {
  const { selection } = editor;
  if (!selection) return null;

  const [match] = Editor.nodes(editor, {
    at: selection,
    match: (n) => Editor.isBlock(editor, n) && n.type === 'list-item',
    mode: 'lowest',
  });
  return match as NodeEntry<ListItemElement>;
};

export const getParentList = (
  editor: Editor,
  node: Node
): NodeEntry<ListElement> | null => {
  const path = ReactEditor.findPath(editor, node);
  const parentList = Editor.above(editor, {
    at: path,
    match: (node) => isList(editor, node),
  });

  if (parentList) {
    const [parentListNode, parentListPath] = parentList;
    if (isList(editor, parentListNode)) {
      return [parentListNode, parentListPath];
    }
    return null;
  }
  return null;
};

export const getParentListItem = (
  editor: Editor,
  node: Node
): NodeEntry<ListItemElement> | null => {
  const path = ReactEditor.findPath(editor, node);
  const parentListItem = Editor.above(editor, {
    at: path,
    match: (node) => isListItem(editor, node),
  });

  if (parentListItem) {
    const [parentListItemNode, parentListItemPath] = parentListItem;
    if (isListItem(editor, parentListItemNode)) {
      return [parentListItemNode, parentListItemPath];
    }
    return null;
  }
  return null;
};

export const isList = (editor: Editor, node: Node): node is ListElement => {
  return Editor.isBlock(editor, node) && node.type === 'unordered-list';
};

export const isListItem = (
  editor: Editor,
  node: Node
): node is ListItemElement => {
  return Editor.isBlock(editor, node) && node.type === 'list-item';
};

export const isListItemText = (
  editor: Editor,
  node: Node
): node is ListItemTextElement => {
  return Editor.isBlock(editor, node) && node.type === 'list-item-text';
};

export const getEmptyList = (): ListElement => {
  return {
    type: 'unordered-list',
    children: [],
  };
};

export const getEmptyListItem = (): ListItemElement => {
  return {
    type: 'list-item',
    children: [],
  };
};

export const getEmptyListItemText = (): ListItemTextElement => {
  return {
    type: 'list-item-text',
    children: [],
  };
};

export const getListItemWithEmptyText = (): ListItemElement => {
  return {
    type: 'list-item',
    children: [{ type: 'list-item-text', children: [{ text: '' }] }],
  };
};

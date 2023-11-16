import { Editor, Node, Path, Transforms } from 'slate';

import {
  getSelectionLowestListItem,
  getParentList,
  getParentListItem,
} from './common';
import { increaseListItemDepth } from './increaseDepth';

export const decreaseListDepth = (editor: Editor): void => {
  // get current list item
  const currentListItem = getSelectionLowestListItem(editor);
  if (!currentListItem) return;
  const [currentListItemNode, currentListItemPath] = currentListItem;
  // get parent list
  const parentList = getParentList(editor, currentListItem[0]);
  if (!parentList) return;
  const [parentListNode, parentListPath] = parentList;
  // get above list item
  const parentListItem = getParentListItem(editor, currentListItemNode);

  const currentListItemIndex =
    currentListItemPath[currentListItemPath.length - 1];
  const nextSiblings = parentListNode.children.slice(currentListItemIndex + 1);
  const previousSiblings = parentListNode.children.slice(
    0,
    currentListItemIndex
  );
  // We have to move all subsequent sibling "list-items" into a new "list" that will be
  // nested in the "list-item" we're trying to move.
  nextSiblings.forEach(() => {
    // The next sibling path is always the same, because once we move out the next sibling,
    // another one will take its place.
    const nextSiblingPath = parentListPath.concat(currentListItemIndex + 1);
    increaseListItemDepth(editor, nextSiblingPath);
  });

  Editor.withoutNormalizing(editor, () => {
    if (parentListItem) {
      const [, parentListItemPath] = parentListItem;
      // Move the "list-item" to the grandparent "list".
      Transforms.moveNodes(editor, {
        at: currentListItemPath,
        to: Path.next(parentListItemPath),
      });
      // We've moved the "list-item" and all its subsequent sibling "list-items" out of this list.
      // So in case there are no more "list-items" left, we should remove the list.
      if (previousSiblings.length === 0) {
        Transforms.removeNodes(editor, { at: parentListPath });
      }
      return;
    }
    // Move the "list-item" to the root of the editor.
    const listItemTextPath = currentListItemPath.concat(0);
    const listItemNestedListPath = currentListItemPath.concat(1);

    if (Node.has(editor, listItemNestedListPath)) {
      Transforms.setNodes(
        editor,
        { type: 'unordered-list' },
        { at: listItemNestedListPath }
      );
      Transforms.liftNodes(editor, { at: listItemNestedListPath });
      Transforms.liftNodes(editor, { at: Path.next(currentListItemPath) });
    }

    if (Node.has(editor, listItemTextPath)) {
      Transforms.setNodes(
        editor,
        { type: 'paragraph' },
        { at: listItemTextPath }
      );
      Transforms.liftNodes(editor, { at: listItemTextPath });
      Transforms.liftNodes(editor, { at: currentListItemPath });
    }
  });
};

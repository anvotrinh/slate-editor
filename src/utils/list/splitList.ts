import { Editor, Path, Transforms } from 'slate';

import {
  isSelectionAtEndOfCurrentBlock,
  isSelectionAtStartOfCurrentBlock,
} from '../selection';
import {
  getEmptyListItem,
  getListItemWithEmptyText,
  getSelectionLowestListItem,
} from './common';

export const splitList = (editor: Editor): void => {
  // get current list item
  const currentListItem = getSelectionLowestListItem(editor);
  if (!currentListItem) return;
  const [currentListItemNode, currentListItemPath] = currentListItem;

  // if cursor at the start, no need split, just add a new "list-item" above
  if (isSelectionAtStartOfCurrentBlock(editor)) {
    Transforms.insertNodes(editor, getListItemWithEmptyText(), {
      at: currentListItemPath,
    });
    return;
  }

  const listItemTextPath = currentListItemPath.concat(0);
  const newListItemPath = Path.next(currentListItemPath);
  const newListItemTextPath = Path.next(listItemTextPath);

  Editor.withoutNormalizing(editor, () => {
    // if cursor at the end, no need split, insert new "list-item" in below
    if (isSelectionAtEndOfCurrentBlock(editor)) {
      Transforms.insertNodes(editor, getListItemWithEmptyText(), {
        at: newListItemPath,
      });
      // Move the cursor to the new "list-item".
      Transforms.select(editor, newListItemPath);
    } else {
      // if cursor in the middle of "list-item-text"
      // split current "list-item-text" element into 2
      Transforms.splitNodes(editor);

      // The current "list-item-text" has a parent "list-item", the new one needs its own.
      Transforms.wrapNodes(editor, getEmptyListItem(), {
        at: newListItemTextPath,
      });

      // Move the new "list-item" up to be a sibling of the original "list-item".
      Transforms.moveNodes(editor, {
        at: newListItemTextPath,
        to: newListItemPath,
      });
    }
    // if current "list-item" has UL, then move it to the new "list-item"
    if (currentListItemNode.children.length > 1) {
      Transforms.moveNodes(editor, {
        at: Path.next(listItemTextPath),
        to: newListItemPath.concat(1),
      });
    }
  });
};

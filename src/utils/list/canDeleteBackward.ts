import { Editor } from 'slate';

import { getSelectionLowestListItem, getDepthOfListItem } from './common';
import { isSelectionAtStartOfCurrentBlock } from '../selection';

// if the cursor is at the start of first root list item, slate can't delete it
// by default
export const canDeleteBackward = (editor: Editor): boolean => {
  const currentListItem = getSelectionLowestListItem(editor);
  if (!currentListItem) return true;

  const [currentListItemNode, currentListItemPath] = currentListItem;

  const isFirstListItem =
    currentListItemPath[currentListItemPath.length - 1] === 0;

  const isInNestedList = getDepthOfListItem(editor, currentListItemNode) > 1;

  return (
    isInNestedList ||
    !isFirstListItem ||
    !isSelectionAtStartOfCurrentBlock(editor)
  );
};

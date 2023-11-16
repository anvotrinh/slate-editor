import { Editor, Path, Transforms } from 'slate';
import {
  getSelectionLowestListItem,
  isListItem,
  isList,
  getEmptyList,
  getDepthOfListItem,
} from './common';

export const increaseListDepth = (editor: Editor): void => {
  const currentListItem = getSelectionLowestListItem(editor);
  if (!currentListItem) return;
  const [currentListItemNode, currentListItemPath] = currentListItem;
  // check max depth
  const depth = getDepthOfListItem(editor, currentListItemNode);
  if (depth >= 3) return;
  increaseListItemDepth(editor, currentListItemPath);
};

export const increaseListItemDepth = (
  editor: Editor,
  currentListItemPath: Path
): void => {
  // check if prev sibling is "list-item"
  if (!Path.hasPrevious(currentListItemPath)) return;
  const prevListItemPath = Path.previous(currentListItemPath);
  const [prevListItem] = Editor.node(editor, prevListItemPath);
  if (!isListItem(editor, prevListItem)) return;

  const lastPrevChild = prevListItem.children[prevListItem.children.length - 1];
  const lastPrevChildPath = prevListItemPath.concat(
    prevListItem.children.length - 1
  );

  // if the prev "list-item" has "list" inside, move the current "list-item" to it's "list"
  if (isList(editor, lastPrevChild)) {
    Transforms.moveNodes(editor, {
      at: currentListItemPath,
      to: lastPrevChildPath.concat(lastPrevChild.children.length),
    });
  } else {
    // if the prev "list-item" doesn't has a "list" inside
    // create a new "list" and add to prev "list-item".
    Editor.withoutNormalizing(editor, () => {
      Transforms.wrapNodes(editor, getEmptyList(), { at: currentListItemPath });
      Transforms.moveNodes(editor, {
        at: currentListItemPath,
        to: prevListItemPath.concat(prevListItem.children.length),
      });
    });
  }
};

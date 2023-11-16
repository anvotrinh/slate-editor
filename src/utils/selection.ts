import {
  Editor,
  Element,
  Node,
  NodeEntry,
  Point,
  Range,
  Transforms,
} from 'slate';
import { ReactEditor } from 'slate-react';
import { ElementType } from '../components/editor/Element';

export const isSelectionCollapsed = (editor: Editor): boolean => {
  const { selection } = editor;
  return selection ? Range.isCollapsed(selection) : true;
};

export const isSelectionExpanded = (editor: Editor): boolean => {
  const { selection } = editor;
  return selection ? Range.isExpanded(selection) : false;
};

export const isSelectionHasElementType = (
  editor: Editor,
  elementType: ElementType
): boolean => {
  return !!getFirstElementTypeInSelection(editor, elementType);
};

export function getFirstElementTypeInSelection<T extends Element>(
  editor: Editor,
  elementType: T['type']
): NodeEntry<T> | undefined {
  const [match] = Editor.nodes<T>(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === elementType,
  });
  return match;
}

export const getSelectionLowestBlock = (
  editor: Editor
): NodeEntry<Element> | null => {
  const { selection } = editor;
  if (!selection) return null;

  const [match] = Editor.nodes(editor, {
    at: selection,
    match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n),
    mode: 'lowest',
  });

  return match as NodeEntry<Element>;
};

const isSelectionAtEdgeOfCurrentBlock = (
  editor: Editor,
  edge: 'start' | 'end'
): boolean => {
  const { selection } = editor;
  if (!selection) return false;
  const nodeEntry = getSelectionLowestBlock(editor);
  if (!nodeEntry) return false;
  const [, path] = nodeEntry;
  const edgePoint =
    edge === 'start' ? Editor.start(editor, path) : Editor.end(editor, path);
  return Point.equals(selection.anchor, edgePoint);
};

export const isSelectionAtStartOfCurrentBlock = (editor: Editor): boolean => {
  return isSelectionAtEdgeOfCurrentBlock(editor, 'start');
};

export const isSelectionAtEndOfCurrentBlock = (editor: Editor): boolean => {
  return isSelectionAtEdgeOfCurrentBlock(editor, 'end');
};

const getCurrentAdjacentText = (
  editor: Editor,
  offset: number
): string | undefined => {
  const { selection } = editor;
  if (!selection) return;
  const nodeEntry = getSelectionLowestBlock(editor);
  if (!nodeEntry) return;
  const [currentBlock] = nodeEntry;
  const blockString = Node.string(currentBlock);
  return blockString[selection.anchor.offset + offset];
};

export const getCurrentPreviousText = (editor: Editor): string | undefined => {
  return getCurrentAdjacentText(editor, -1);
};

export const getCurrentNextText = (editor: Editor): string | undefined => {
  return getCurrentAdjacentText(editor, 0);
};

export const focusBlurredSelection = (editor: Editor): void => {
  ReactEditor.focus(editor);
  // if only use ReactEditor.focus, the cursor will display at the start
  // of the editor. So we have to use blurSelection.
  Transforms.deselect(editor);
  if (!editor.blurSelection) return;
  Transforms.select(editor, editor.blurSelection);
};

import { Editor, Element, Node, Range } from 'slate';
import { ReactEditor } from 'slate-react';

export function isElementHasType<T extends Element>(
  element: Element,
  elementType: T['type']
): element is T {
  return element.type === elementType;
}

export const isElementLastChild = (
  editor: Editor,
  element: Element
): boolean => {
  const path = ReactEditor.findPath(editor, element);
  if (path.length === 0) return true;
  const parentElement = Node.parent(editor, path);
  const childIndex = path[path.length - 1];
  return childIndex === parentElement.children.length - 1;
};

export const isElementSelected = (
  editor: Editor,
  element: Element
): boolean => {
  try {
    const { selection } = editor;
    if (!selection) return false;
    const elementPath = ReactEditor.findPath(editor, element);
    const elementRange: Range = {
      anchor: Editor.start(editor, elementPath),
      focus: Editor.end(editor, elementPath),
    };
    return (
      Range.includes(elementRange, selection.anchor) ||
      Range.includes(elementRange, selection.focus)
    );
  } catch (e) {
    // sometime Path of the element was changed by inserting or deleting other elements
    // in the parent block. Then Editor.start/end couldn't get points from outdated
    // path and caused the error. Since it didn't affect to check isElementSelected
    // at that time, so to fix the bug we wrapped it with try-catch block
    return false;
  }
};

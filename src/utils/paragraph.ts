import { Editor, Element, NodeEntry, Text } from 'slate';
import { ParagraphElement } from '../components/editor/paragraph';
import { getSelectionLowestBlock } from './selection';

export const getCurrentEmptyParagraph = (
  editor: Editor
): NodeEntry<Element> | null => {
  const nodeEntry = getSelectionLowestBlock(editor);
  if (!nodeEntry) return null;
  const [currentBlock] = nodeEntry;
  if (isElementEmptyParagraph(currentBlock)) return nodeEntry;
  return null;
};

export const isElementEmptyParagraph = (element: Element): boolean => {
  if (element.type !== 'paragraph') return false;
  // element only has 1 child
  if (element.children.length !== 1) return false;
  const childOfElement = element.children[0];
  // child of element is text and has an empty string
  return Text.isText(childOfElement) && childOfElement.text === '';
};

export const getEmptyParagraph = (): ParagraphElement => {
  return {
    type: 'paragraph',
    children: [{ text: '' }],
  };
};

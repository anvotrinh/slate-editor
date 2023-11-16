import { Editor, Transforms, Element, Node, Path } from 'slate';
import { ReactEditor } from 'slate-react';

import { ElementType } from '../components/editor/Element';
import { getEmptyListItem, unwrapList } from './list';
import { getEmptyParagraph } from './paragraph';
import {
  getSelectionLowestBlock,
  isSelectionAtEndOfCurrentBlock,
} from './selection';

export const EMBED_TYPES: ElementType[] = [
  'video',
  'embed-youtube',
  'embed-vimeo',
  'embed-spotify',
  'embed-twitter',
  'embed-instagram',
  'embed-facebook',
  'embed-brightcove',
  'embed-page',
];
export const LIST_TYPES: ElementType[] = ['unordered-list'];
const INLINE_TYPES: ElementType[] = ['link', 'sup'];
const VOID_TYPES: ElementType[] = EMBED_TYPES.concat([
  'code-highlight',
  'sup',
  'horizontal-rule',
  'image',
]);

export const isBlockActive = (editor: Editor, format: ElementType): boolean => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === format,
  });

  return !!match;
};

export const toggleBlock = (editor: Editor, format: ElementType): void => {
  LIST_TYPES.includes(format)
    ? toggleListTypeBlock(editor, format)
    : toggleOtherTypeBlock(editor, format);
};

const toggleListTypeBlock = (editor: Editor, format: ElementType): void => {
  const isActive = isBlockActive(editor, format);
  if (isActive) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        LIST_TYPES.includes(n.type),
      split: true,
    });
    Transforms.setNodes(editor, { type: 'paragraph' });
    return;
  }
  const nodeEntry = getSelectionLowestBlock(editor);
  if (!nodeEntry) return;
  const currentBlockPath = nodeEntry[1];

  Editor.withoutNormalizing(editor, () => {
    Transforms.setNodes(
      editor,
      { type: 'list-item-text' },
      { at: currentBlockPath }
    );
    Transforms.wrapNodes(editor, getEmptyListItem(), { at: currentBlockPath });
    const list = { type: format, children: [] } as Element;
    Transforms.wrapNodes(editor, list, { at: currentBlockPath });
  });
};

const toggleOtherTypeBlock = (editor: Editor, format: ElementType) => {
  const isActive = isBlockActive(editor, format);
  // keep flat if format is h1->h6 and pre, just change the type
  // need to use format === '...' to dodge ts error (might be bug)
  if (
    format === 'paragraph' ||
    format === 'heading-one' ||
    format === 'heading-two' ||
    format === 'heading-three' ||
    format === 'heading-four' ||
    format === 'heading-five' ||
    format === 'heading-six' ||
    format === 'preformatted'
  ) {
    Editor.withoutNormalizing(editor, () => {
      Transforms.setNodes(editor, {
        type: isActive ? 'paragraph' : format,
      });
      unwrapList(editor);
    });
  } else if (isActive) {
    // if the format was applied, unwrap it
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === format,
    });
  } else {
    // if the format wasn't applied or not in keepFlat types, wrap it
    Editor.withoutNormalizing(editor, () => {
      const block = { type: format, children: [] } as Element;
      Transforms.wrapNodes(editor, block);
      unwrapList(editor);
    });
  }
};

export const focusAndToggleBlock = (
  editor: Editor,
  format: ElementType
): void => {
  if (!ReactEditor.isFocused(editor)) {
    ReactEditor.focus(editor);
  }
  toggleBlock(editor, format);
};

export const getCurrentBlockTypeInList = (
  editor: Editor,
  typeList: ElementType[]
): string => {
  const [match] = Editor.nodes<Element>(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && typeList.includes(n.type),
  });
  return match ? match[0].type : typeList[0];
};

export const isInsideOf = (
  editor: Editor,
  node: Node,
  wrapperTypes: ElementType[]
): boolean => {
  const path = ReactEditor.findPath(editor, node);
  const match = Editor.above(editor, {
    at: path,
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      wrapperTypes.includes(n.type),
  });
  return !!match;
};

export const withBlocks = (editor: Editor): Editor => {
  const { normalizeNode, isInline, isVoid } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // blockquote, box must contain blocks
    if (Element.isElement(node) && ['blockquote', 'box'].includes(node.type)) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Editor.isBlock(editor, child)) continue;
        const paragraph = { type: 'paragraph', children: [] } as Element;
        Transforms.wrapNodes(editor, paragraph, { at: childPath });
        return;
      }
    }

    normalizeNode(entry);
  };

  editor.isInline = (element) => {
    return INLINE_TYPES.includes(element.type) ? true : isInline(element);
  };

  editor.isVoid = (element) =>
    VOID_TYPES.includes(element.type) ? true : isVoid(element);

  return editor;
};

export const countElementsByType = (
  editor: Editor,
  format: ElementType
): number => {
  let count = 0;
  const elementArr = Array.from(Node.elements(editor));
  for (const [element] of elementArr) {
    element.type === format && count++;
  }
  return count;
};

export const splitCurrentBlockToParagraph = (editor: Editor): void => {
  const nodeEntry = getSelectionLowestBlock(editor);
  if (!nodeEntry) return;
  const currentBlockPath = nodeEntry[1];
  // handle at the end of block case, since Transforms.splitNodes
  // doesn't split the block in this case
  if (isSelectionAtEndOfCurrentBlock(editor)) {
    const insertPath = [...currentBlockPath];
    insertPath[insertPath.length - 1] = insertPath[insertPath.length - 1] + 1;
    Transforms.insertNodes(editor, getEmptyParagraph(), {
      at: insertPath,
    });
    Transforms.move(editor);
    return;
  }
  // handle normal case
  Transforms.splitNodes(editor);
  Transforms.setNodes(editor, { type: 'paragraph' });
};

export const isVoidBlock = (editor: Editor, element: Element): boolean => {
  return Editor.isVoid(editor, element) && Editor.isBlock(editor, element);
};

export const removePreviousEmptyBlock = (editor: Editor): void => {
  const nodeEntry = getSelectionLowestBlock(editor);
  if (!nodeEntry) return;

  const currentBlockPath = nodeEntry[1];
  if (!Path.hasPrevious(currentBlockPath)) return;

  const prevPath = Path.previous(currentBlockPath);
  const [prevBlock] = Editor.node(editor, prevPath);
  if (Node.string(prevBlock)) return;

  Transforms.removeNodes(editor, { at: prevPath });
};

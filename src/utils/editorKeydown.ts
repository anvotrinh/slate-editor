import { KeyboardEvent } from 'react';
import { Editor, Node, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { store } from '../store';
import { openLinkModal } from '../store/modal';
import { isVoidBlock, splitCurrentBlockToParagraph } from './block';
import { isElementLastChild } from './element';
import { isHeadingElement } from './heading';
import {
  decreaseListDepth,
  increaseListDepth,
  splitList,
  canDeleteBackward,
} from './list';
import { toggleMark } from './mark';
import {
  getCurrentEmptyParagraph,
  getEmptyParagraph,
  isElementEmptyParagraph,
} from './paragraph';
import {
  getCurrentNextText,
  getCurrentPreviousText,
  getSelectionLowestBlock,
  isSelectionAtEndOfCurrentBlock,
  isSelectionExpanded,
} from './selection';

const handleKeyDownEnter = (editor: Editor, e: KeyboardEvent): void => {
  // not handle expanded case
  if (isSelectionExpanded(editor)) return;

  const nodeEntry = getSelectionLowestBlock(editor);
  if (!nodeEntry) return;

  const [currentBlock, currentBlockPath] = nodeEntry;
  // handle enter void
  if (isVoidBlock(editor, currentBlock)) {
    e.preventDefault();
    Transforms.insertNodes(editor, getEmptyParagraph(), {
      at: currentBlockPath,
    });
    Transforms.move(editor, { reverse: true });
    return;
  }

  // handle enter footnote
  if (currentBlock.type === 'footnote') {
    e.preventDefault();
    if (e.shiftKey) {
      if (getCurrentPreviousText(editor) === '\n') {
        editor.deleteBackward('character');
        splitCurrentBlockToParagraph(editor);
        return;
      }
      if (getCurrentNextText(editor) === '\n') {
        editor.deleteForward('character');
        splitCurrentBlockToParagraph(editor);
        return;
      }
      editor.insertText('\n');
      return;
    }
    splitCurrentBlockToParagraph(editor);
    return;
  }

  // use Enter + Shift = New Line for other shift case
  if (e.shiftKey) {
    e.preventDefault();
    editor.insertText('\n');
    return;
  }

  // handle enter list
  if (currentBlock.type === 'list-item-text') {
    e.preventDefault();
    if (Node.string(currentBlock)) {
      splitList(editor);
    } else {
      decreaseListDepth(editor);
    }
    return;
  }
  if (currentBlock.type === 'preformatted') {
    e.preventDefault();
    // handle double enter case
    if (
      isSelectionAtEndOfCurrentBlock(editor) &&
      Node.string(currentBlock).endsWith('\n')
    ) {
      editor.deleteBackward('character');
      Transforms.insertNodes(editor, getEmptyParagraph(), {
        at: Path.next(currentBlockPath),
      });
      Transforms.move(editor);
      return;
    }
    // handle normal enter case
    editor.insertText('\n');
    return;
  }
  // handle enter heading
  if (
    isHeadingElement(currentBlock) &&
    isSelectionAtEndOfCurrentBlock(editor)
  ) {
    e.preventDefault();
    Transforms.insertNodes(editor, getEmptyParagraph(), {
      at: Path.next(currentBlockPath),
    });
    Transforms.move(editor);
    return;
  }
  const parentBlock = Node.parent(editor, currentBlockPath);
  const parentBlockPath = Path.parent(currentBlockPath);
  if (Editor.isEditor(parentBlock)) return;
  // current block type = paragraph, handle double enter case in box and blockquote
  if (
    ['box', 'blockquote'].includes(parentBlock.type) &&
    isElementLastChild(editor, currentBlock) &&
    Path.hasPrevious(currentBlockPath) &&
    isElementEmptyParagraph(currentBlock)
  ) {
    e.preventDefault();
    const emptyParagraph = getCurrentEmptyParagraph(editor);
    Transforms.insertNodes(editor, getEmptyParagraph(), {
      at: Path.next(parentBlockPath),
    });
    Transforms.move(editor);
    if (emptyParagraph) {
      const emptyParagraphPath = emptyParagraph[1];
      Transforms.removeNodes(editor, { at: emptyParagraphPath });
    }
    return;
  }
};

const handleKeyDownBackspace = (editor: Editor, e: KeyboardEvent): void => {
  // not handle expanded case
  if (isSelectionExpanded(editor)) return;

  const nodeEntry = getSelectionLowestBlock(editor);
  if (!nodeEntry) return;

  const [currentBlock, currentBlockPath] = nodeEntry;
  // handle backspace heading, preformatted, footnote
  if (
    (isHeadingElement(currentBlock) ||
      currentBlock.type === 'preformatted' ||
      currentBlock.type === 'footnote') &&
    Node.string(currentBlock) === ''
  ) {
    e.preventDefault();
    Transforms.setNodes(editor, { type: 'paragraph' });
    return;
  }

  const parentBlock = Node.parent(editor, currentBlockPath);
  if (Editor.isEditor(parentBlock)) return;
  const parentPath = ReactEditor.findPath(editor, parentBlock);
  // handle backspace list item
  if (currentBlock.type === 'list-item-text' && !canDeleteBackward(editor)) {
    e.preventDefault();
    decreaseListDepth(editor);
    return;
  }
  // handle backspace list item
  if (
    ['box', 'blockquote'].includes(parentBlock.type) &&
    parentBlock.children.length === 1 &&
    isElementEmptyParagraph(currentBlock)
  ) {
    e.preventDefault();
    Transforms.unwrapNodes(editor, { at: parentPath });
    return;
  }
};

const handleKeyDownSpace = (editor: Editor, e: KeyboardEvent): void => {
  const nodeEntry = getSelectionLowestBlock(editor);
  if (!nodeEntry) return;

  const [currentBlock, currentBlockPath] = nodeEntry;
  if (
    currentBlock.type === 'footnote' &&
    isSelectionAtEndOfCurrentBlock(editor) &&
    Node.string(currentBlock).endsWith('\n')
  ) {
    e.preventDefault();
    editor.deleteBackward('character');
    Transforms.insertNodes(editor, getEmptyParagraph(), {
      at: Path.next(currentBlockPath),
    });
    Transforms.move(editor);
    return;
  }
};

const handleKeyDownTab = (editor: Editor, e: KeyboardEvent): void => {
  const nodeEntry = getSelectionLowestBlock(editor);
  if (!nodeEntry) return;

  const [currentBlock] = nodeEntry;
  if (currentBlock.type !== 'list-item-text') return;

  e.preventDefault();
  if (e.shiftKey) {
    decreaseListDepth(editor);
    return;
  }
  increaseListDepth(editor);
};

const handleEditorKeydown = (editor: Editor, e: KeyboardEvent): void => {
  if (e.metaKey) {
    switch (e.key) {
      case 'b':
        return toggleMark(editor, 'bold');
      case 'i':
        return toggleMark(editor, 'italic');
      case 'd':
        return toggleMark(editor, 'strikethrough');
      case 'k':
        store.dispatch(openLinkModal());
        return;
      default:
        return;
    }
  }
  switch (e.key) {
    case 'Enter':
      return handleKeyDownEnter(editor, e);
    case 'Backspace':
      return handleKeyDownBackspace(editor, e);
    case ' ':
      return handleKeyDownSpace(editor, e);
    case 'Tab':
      return handleKeyDownTab(editor, e);
    default:
      return;
  }
};

export default handleEditorKeydown;

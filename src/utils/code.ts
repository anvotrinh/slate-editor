import { Descendant, Editor, Node, Text, Transforms } from 'slate';
import { CodeElement } from '../components/editor/code';
import { ReactEditor } from 'slate-react';
import { getSelectionLowestBlock, isSelectionExpanded } from './selection';
import { removePreviousEmptyBlock } from './block';
import { unwrapList } from './list';

export const insertCode = (editor: Editor): void => {
  const codeEditorElement: CodeElement = {
    type: 'code-highlight',
    value: '',
    language: 'java',
    children: [{ text: '' }],
  };
  if (isSelectionExpanded(editor)) {
    codeEditorElement.value = getSelectionString(editor);
    Transforms.insertNodes(editor, codeEditorElement);
    removePreviousEmptyBlock(editor);
    return;
  }
  const nodeEntry = getSelectionLowestBlock(editor);
  if (!nodeEntry) return;
  const [node, path] = nodeEntry;
  // get current block string
  codeEditorElement.value = getNodeString(node).trim();
  // select from start to end of current block
  Transforms.select(editor, {
    anchor: Editor.start(editor, path),
    focus: Editor.end(editor, path),
  });
  Transforms.insertNodes(editor, codeEditorElement);
  // unwrap list if it's inside of list
  if (node.type === 'list-item-text') {
    unwrapList(editor);
  }

  removePreviousEmptyBlock(editor);
};

export const setCode = (
  editor: Editor,
  element: CodeElement,
  newProperties: Partial<CodeElement>
): void => {
  const path = ReactEditor.findPath(editor, element);
  Transforms.setNodes(editor, newProperties, { at: path });
};

// convert selection to string and add new line
const getSelectionString = (editor: Editor): string => {
  const { selection } = editor;
  if (!selection) return '';
  return Editor.fragment(editor, selection)
    .map((n) => getNodeString(n))
    .join('')
    .trim();
};

export const getNodeString = (node: Descendant): string => {
  if (Text.isText(node)) return node.text;
  if (node.type === 'paragraph') {
    return Node.string(node) + '\n\n';
  }
  return node.children.map((n) => getNodeString(n)).join('');
};

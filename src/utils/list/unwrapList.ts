import { Editor, Transforms } from 'slate';

export const unwrapList = (editor: Editor): void => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      Editor.isBlock(editor, n) &&
      ['unordered-list', 'list-item', 'list-item-text'].includes(n.type),
    mode: 'all',
  });
};

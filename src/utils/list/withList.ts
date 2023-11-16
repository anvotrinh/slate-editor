import { Editor } from 'slate';

import { normalizeList } from './normalizeList';
import { normalizeListItem } from './normalizeListItem';
import { normalizeListItemText } from './normalizeListItemText';
import { normalizeOrphanListItem } from './normalizeOrphanListItem';
import { normalizeOrphanListItemText } from './normalizeOrphanListItemText';

const normalizers = [
  normalizeList,
  normalizeListItem,
  normalizeListItemText,
  normalizeOrphanListItem,
  normalizeOrphanListItemText,
];
export const withList = (editor: Editor): Editor => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    for (const normalizer of normalizers) {
      const normalized = normalizer(editor, entry);
      if (normalized) return;
    }
    normalizeNode(entry);
  };

  return editor;
};

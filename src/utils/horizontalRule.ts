import { Editor, Transforms } from 'slate';
import { HorizontalRuleElement } from '../components/editor/horizontalRule';
import { removePreviousEmptyBlock } from './block';

export const insertHorizontalRule = (editor: Editor): void => {
  const horizontalRuleElement: HorizontalRuleElement = {
    type: 'horizontal-rule',
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, horizontalRuleElement);
  removePreviousEmptyBlock(editor);
  Transforms.move(editor);
};

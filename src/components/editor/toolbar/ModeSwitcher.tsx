import React from 'react';
import cx from 'classnames';
import { useSlateStatic } from 'slate-react';
import { showAlertMessage } from '../../../utils/common';
import i18n from '../../../utils/i18n';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  setEditorMode,
  setMarkdownText,
  setSlateInitialValue,
} from '../../../store/editor';
import { initialPost } from '../../../utils/const';
import serialize from '../../../utils/serialize';
import { parsePost } from '../../../store/post';
import deserialize from '../../../utils/deserialize';
import {
  isRichEditorUnsupported,
  setEditorModeLocal,
} from '../../../utils/editorMode';

const ModeSwitcher = (): JSX.Element => {
  const editor = useSlateStatic();
  const dispatch = useAppDispatch();
  const { editorMode, markdownText } = useAppSelector((state) => state.editor);

  const handleRichTextClick = async () => {
    if (editorMode === 'richText') return;
    const resultAction = await dispatch(
      parsePost({
        body: markdownText,
        format: 'editor',
      })
    );
    if (parsePost.fulfilled.match(resultAction)) {
      const slateValue = deserialize(resultAction.payload.html);
      dispatch(setSlateInitialValue(slateValue));
      dispatch(setEditorMode('richText'));
      setEditorModeLocal('richText');
    } else {
      showAlertMessage('parse_post_failed_message');
    }
  };

  const handleMarkdownClick = () => {
    if (editorMode === 'markdown') return;
    const markdownText = serialize(editor);
    dispatch(setMarkdownText(markdownText));
    dispatch(setEditorMode('markdown'));
    setEditorModeLocal('markdown');
  };

  const rteClassName = cx({
    editorModeSwitch__label: true,
    'editorModeSwitch__label--rte': true,
    'editorModeSwitch__label--active': editorMode === 'richText',
    'editorModeSwitch__label--disabled': isRichEditorUnsupported(
      initialPost.body
    ),
  });
  const mdClassName = cx({
    editorModeSwitch__label: true,
    'editorModeSwitch__label--md': true,
    'editorModeSwitch__label--active': editorMode === 'markdown',
  });
  return (
    <li className="editorToolList__item">
      <div className="editorModeSwitch">
        <label className={rteClassName} onClick={handleRichTextClick}>
          {i18n.get('rich_text')}
        </label>
        <label className={mdClassName} onClick={handleMarkdownClick}>
          {i18n.get('markdown')}
        </label>
      </div>
    </li>
  );
};

export default ModeSwitcher;

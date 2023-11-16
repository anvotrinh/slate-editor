import React from 'react';
import { useSlateStatic } from 'slate-react';
import { FaEye } from 'react-icons/fa';

import ToolbarButton from '../toolbar/ToolbarButton';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { openPreviewModal } from '../../../store/modal';
import { parsePost } from '../../../store/post';
import serialize from '../../../utils/serialize';
import { showAlertMessage } from '../../../utils/common';
import i18n from '../../../utils/i18n';

const PreviewButton = (): JSX.Element => {
  const editor = useSlateStatic();
  const dispatch = useAppDispatch();
  const { markdownText, editorMode } = useAppSelector((state) => state.editor);

  const handleMouseDown = async () => {
    const postMarkdown =
      editorMode === 'richText' ? serialize(editor) : markdownText;
    const resultAction = await dispatch(
      parsePost({ body: postMarkdown, format: 'html' })
    );
    if (parsePost.rejected.match(resultAction)) {
      showAlertMessage(resultAction.payload);
      return;
    }
    dispatch(openPreviewModal());
  };
  return (
    <ToolbarButton onMouseDown={handleMouseDown} label={i18n.get('preview')}>
      <FaEye />
    </ToolbarButton>
  );
};

export default PreviewButton;

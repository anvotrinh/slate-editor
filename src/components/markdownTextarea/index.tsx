import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setMarkdownText } from '../../store/editor';

type Props = {
  isVisible: boolean;
};

function MarkdownTextarea({ isVisible }: Props): JSX.Element {
  const dispatch = useAppDispatch();
  const { editorReadOnly, markdownText } = useAppSelector(
    (state) => state.editor
  );

  const style = isVisible ? {} : { display: 'none' };
  return (
    <div className="editor__body editor__body--active" style={style}>
      <TextareaAutosize
        className="editorBody editorBody--md"
        value={markdownText}
        onChange={(e) => dispatch(setMarkdownText(e.currentTarget.value))}
        readOnly={editorReadOnly}
        style={editorReadOnly ? { opacity: 0.5 } : {}}
      />
    </div>
  );
}

export default MarkdownTextarea;

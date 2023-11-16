import React, { useCallback, useRef } from 'react';
import { Editable, useSlateStatic } from 'slate-react';

import Leaf from './Leaf';
import Element from './Element';
import { useAppSelector } from '../../hooks/redux';
import handleEditorKeydown from '../../utils/editorKeydown';
import { focusBlurredSelection } from '../../utils/selection';

type Props = {
  isVisible: boolean;
};

const RichTextEditor = ({ isVisible }: Props): JSX.Element => {
  const editor = useSlateStatic();
  const { editorReadOnly } = useAppSelector((state) => state.editor);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="editor__body editor__body--active"
      style={isVisible ? {} : { display: 'none' }}
    >
      <div className="editorBody editorBody--rte">
        <div
          ref={editorWrapperRef}
          className="editorBody__maWrapper"
          style={editorReadOnly ? { opacity: 0.5 } : {}}
          onClick={(e) => {
            if (e.target === editorWrapperRef.current) {
              focusBlurredSelection(editor);
            }
          }}
        >
          <div className="ma">
            <Editable
              className="ma__richEditorBody"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onBlur={() => {
                editor.blurSelection = editor.selection;
              }}
              onKeyDown={(e) => handleEditorKeydown(editor, e)}
              readOnly={editorReadOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;

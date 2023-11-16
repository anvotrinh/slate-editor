import React from 'react';
import { FaCode } from 'react-icons/fa';

import ToolbarButton from '../toolbar/ToolbarButton';
import { useSlate } from 'slate-react';
import { insertCode } from '../../../utils/code';
import { isBlockActive } from '../../../utils/block';
import i18n from '../../../utils/i18n';

const CodeEditorButton = (): JSX.Element => {
  const editor = useSlate();

  return (
    <ToolbarButton
      disabled={isBlockActive(editor, 'footnote')}
      onMouseDown={(event) => {
        event.preventDefault();
        insertCode(editor);
      }}
      label={i18n.get('code')}
    >
      <FaCode />
    </ToolbarButton>
  );
};

export default CodeEditorButton;

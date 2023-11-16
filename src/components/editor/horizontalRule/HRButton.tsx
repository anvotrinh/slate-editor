import React from 'react';
import { useSlate } from 'slate-react';
import { FaMinus } from 'react-icons/fa';

import ToolbarButton from '../toolbar/ToolbarButton';
import { insertHorizontalRule } from '../../../utils/horizontalRule';
import { isBlockActive } from '../../../utils/block';
import i18n from '../../../utils/i18n';

const HRButton = (): JSX.Element => {
  const editor = useSlate();

  return (
    <ToolbarButton
      disabled={isBlockActive(editor, 'footnote')}
      onMouseDown={(event) => {
        event.preventDefault();
        insertHorizontalRule(editor);
      }}
      label={i18n.get('rule')}
    >
      <FaMinus />
    </ToolbarButton>
  );
};

export default HRButton;

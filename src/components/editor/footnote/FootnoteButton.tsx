import React from 'react';
import { useSlate } from 'slate-react';
import { FaAsterisk } from 'react-icons/fa';

import ToolbarButton from '../toolbar/ToolbarButton';
import { insertFootnote } from '../../../utils/footnote';
import { isBlockActive } from '../../../utils/block';
import i18n from '../../../utils/i18n';

const FootnoteButton = (): JSX.Element => {
  const editor = useSlate();

  return (
    <ToolbarButton
      disabled={isBlockActive(editor, 'footnote')}
      onMouseDown={(e) => {
        e.preventDefault();
        insertFootnote(editor);
      }}
      label={i18n.get('footnote')}
    >
      <FaAsterisk />
    </ToolbarButton>
  );
};

export default FootnoteButton;

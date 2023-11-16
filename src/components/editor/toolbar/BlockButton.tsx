import React from 'react';
import { useSlate } from 'slate-react';

import { ElementType } from '../Element';
import ToolbarButton from './ToolbarButton';
import { isBlockActive, toggleBlock } from '../../../utils/block';

type Props = {
  format: ElementType;
  children: React.ReactNode;
  label: string;
};

const BlockButton = ({ format, children, label }: Props): JSX.Element => {
  const editor = useSlate();

  return (
    <ToolbarButton
      disabled={isBlockActive(editor, 'footnote')}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      label={label}
    >
      {children}
    </ToolbarButton>
  );
};

export default BlockButton;

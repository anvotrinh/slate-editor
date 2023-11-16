import React from 'react';
import { useSlateStatic } from 'slate-react';

import { TextFormat } from '../Leaf';
import ToolbarButton from './ToolbarButton';
import { toggleMark } from '../../../utils/mark';

type Props = {
  format: TextFormat;
  children: React.ReactNode;
  label: string;
};

const MarkButton = ({ format, children, label }: Props): JSX.Element => {
  const editor = useSlateStatic();
  return (
    <ToolbarButton
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      label={label}
    >
      {children}
    </ToolbarButton>
  );
};

export default MarkButton;

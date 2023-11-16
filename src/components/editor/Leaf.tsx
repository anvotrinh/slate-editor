import React from 'react';
import { RenderLeafProps } from 'slate-react';

const Leaf = ({ attributes, children, leaf }: RenderLeafProps): JSX.Element => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }

  return (
    <span
      // The following is a workaround for a Chromium bug where,
      // if you have an inline at the end of a block,
      // clicking the end of a block puts the cursor inside the inline
      // instead of inside the final {text: ''} node
      // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
      style={leaf.text === '' ? { paddingLeft: '0.1px' } : {}}
      {...attributes}
    >
      {children}
    </span>
  );
};

export type CustomText = {
  text: string;
  bold?: true;
  italic?: true;
  strikethrough?: true;
};

export type TextFormat = keyof Omit<CustomText, 'text'>;

export default Leaf;

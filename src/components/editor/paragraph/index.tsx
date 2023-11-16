import React from 'react';
import { RenderElementProps, useSlate } from 'slate-react';
import { Descendant } from 'slate';

import { isInsideOf } from '../../../utils/block';

const Paragraph = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element => {
  const editor = useSlate();

  let containerClass = 'ma__p';
  if (isInsideOf(editor, element, ['blockquote'])) {
    containerClass = 'maBlockquote__p';
  }
  return (
    <p className={containerClass} {...attributes}>
      {children}
    </p>
  );
};

export type ParagraphElement = { type: 'paragraph'; children: Descendant[] };

export default Paragraph;

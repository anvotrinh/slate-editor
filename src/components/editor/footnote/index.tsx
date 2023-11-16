import React from 'react';
import { Descendant } from 'slate';
import { RenderElementProps } from 'slate-react';

import { isElementHasType } from '../../../utils/element';

const Footnote = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element | null => {
  if (!isElementHasType<FootnoteElement>(element, 'footnote')) return null;
  return (
    <div className="footnote" {...attributes}>
      <div contentEditable={false}>*{element.index}</div>
      {children}
    </div>
  );
};

export type FootnoteElement = {
  type: 'footnote';
  index: number;
  children: Descendant[];
};

export * from './Sup';
export default Footnote;

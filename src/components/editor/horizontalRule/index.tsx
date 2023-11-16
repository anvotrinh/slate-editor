import React from 'react';
import { Descendant } from 'slate';
import { RenderElementProps } from 'slate-react';

import { isElementHasType } from '../../../utils/element';

const HorizontalRule = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element | null => {
  if (!isElementHasType<HorizontalRuleElement>(element, 'horizontal-rule'))
    return null;
  return (
    <div {...attributes}>
      {children}
      <hr className="ma__hr" />
    </div>
  );
};

export type HorizontalRuleElement = {
  type: 'horizontal-rule';
  children: Descendant[];
};

export default HorizontalRule;

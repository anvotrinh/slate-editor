import React from 'react';
import { RenderElementProps } from 'slate-react';

import { isElementHasType } from '../../../utils/element';
import { CustomText } from '../Leaf';

export const Sup = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element | null => {
  if (!isElementHasType<SupElement>(element, 'sup')) return null;
  return (
    <sup className="ma__notes" {...attributes}>
      {children}*{element.index}
    </sup>
  );
};

export type SupElement = {
  type: 'sup';
  index: number;
  children: CustomText[];
};

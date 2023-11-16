import React from 'react';
import { RenderElementProps } from 'slate-react';

import { isElementHasType } from '../../../utils/element';
import { CustomText } from '../Leaf';

export const ListItemText = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element | null => {
  if (!isElementHasType<ListItemTextElement>(element, 'list-item-text'))
    return null;
  return <div {...attributes}>{children}</div>;
};

export type ListItemTextElement = {
  type: 'list-item-text';
  children: CustomText[];
};

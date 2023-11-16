import React from 'react';
import { Descendant } from 'slate';
import { RenderElementProps } from 'slate-react';

import { isElementHasType } from '../../../utils/element';

export const ListItem = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element | null => {
  if (!isElementHasType<ListItemElement>(element, 'list-item')) return null;
  return (
    <li className="maList__item" {...attributes}>
      {children}
    </li>
  );
};

export type ListItemElement = {
  type: 'list-item';
  children: Descendant[];
};

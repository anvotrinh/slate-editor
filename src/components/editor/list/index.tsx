import React from 'react';
import { Descendant } from 'slate';
import { RenderElementProps, useSlate } from 'slate-react';

import { isElementHasType } from '../../../utils/element';
import { getDepthOfList } from '../../../utils/list';

const List = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element | null => {
  const editor = useSlate();
  if (!isElementHasType<ListElement>(element, 'unordered-list')) return null;

  if (getDepthOfList(editor, element) === 1) {
    return (
      <div className="ma__list" {...attributes}>
        <ul className="maList">{children}</ul>
      </div>
    );
  }
  return (
    <ul className="maList maList--sub" {...attributes}>
      {children}
    </ul>
  );
};

export type ListElement = {
  type: 'unordered-list';
  children: Descendant[];
};

export default List;
export * from './ListItem';
export * from './ListItemText';

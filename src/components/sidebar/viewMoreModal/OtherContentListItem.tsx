import React from 'react';
import cx from 'classnames';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { UnionObject, UnionObjectType } from '../../../apis';
import { getObjectName } from '../utils';
import { toggleUsingItem } from '../../../store/sidebar';

type Props = {
  type: UnionObjectType;
  item: UnionObject;
};
const OtherContentListItem = ({ type, item }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { viewMoreSelected } = sidebarState[type];

  const isSelected = viewMoreSelected.findIndex((i) => i.id === item.id) !== -1;
  const titleClass = cx({
    articleOptionMoreList__label: true,
    selected: isSelected,
  });
  return (
    <li
      className="articleOptionMoreList__item"
      onClick={() => dispatch(toggleUsingItem({ type, item }))}
    >
      <span className={titleClass}>{getObjectName(item)}</span>
    </li>
  );
};

export default OtherContentListItem;

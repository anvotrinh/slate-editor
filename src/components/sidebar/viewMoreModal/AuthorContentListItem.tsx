import React from 'react';
import cx from 'classnames';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { AuthorWithType, UnionObjectType } from '../../../apis';
import { toggleViewMoreSelectedItem } from '../../../store/sidebar';

type Props = {
  type: UnionObjectType;
  item: AuthorWithType;
};
const AuthorContentListItem = ({ type, item }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { viewMoreSelected } = sidebarState[type];

  const imageUrl = item.profile_image?.thumb_360 || '';
  const isSelected = viewMoreSelected.findIndex((v) => v.id === item.id) !== -1;
  const titleClass = cx({
    articleOptionProperty__title: true,
    'articleOptionProperty__title--author': true,
    'articleOptionProperty__title--modalAuthorMore': true,
    selected: isSelected,
  });
  return (
    <li
      className="articleOptionMoreList__item"
      title={item.name}
      onClick={() => dispatch(toggleViewMoreSelectedItem({ type, item }))}
    >
      <div className="articleOptionProperty articleOptionProperty--modalAuthorMore">
        <div
          className="articleOptionProperty__imgWrapper articleOptionProperty__imgWrapper--author"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <p className={titleClass}>{item.name}</p>
      </div>
    </li>
  );
};

export default AuthorContentListItem;

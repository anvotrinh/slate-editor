import React from 'react';
import cx from 'classnames';

import { useAppDispatch } from '../../../hooks/redux';
import { toggleUsingItem } from '../../../store/sidebar';
import { AuthorWithType, UnionObjectType } from '../../../apis';

type Props = {
  type: UnionObjectType;
  item: AuthorWithType;
};
const AuthorOptionItem = ({ type, item }: Props): JSX.Element => {
  const dispatch = useAppDispatch();

  const imageUrl = item.profile_image?.thumb_360 || '';
  const avatarClass = cx({
    articleOptionProperty__imgWrapper: true,
    'articleOptionProperty__imgWrapper--author': true,
    'articleOptionProperty__imgWrapper--authorNoItem': !imageUrl,
  });
  return (
    <li
      className="articleOptionDetailList__item"
      title={item.name}
      onClick={() => dispatch(toggleUsingItem({ type, item }))}
    >
      <div className="articleOptionProperty">
        <div
          className={avatarClass}
          style={{ backgroundImage: `url(${imageUrl}` }}
        />
        <p className="articleOptionProperty__title articleOptionProperty__title--author">
          {item.name}
        </p>
      </div>
    </li>
  );
};

export default AuthorOptionItem;

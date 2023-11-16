import React from 'react';
import cx from 'classnames';

import { AuthorWithType, UnionObjectType } from '../../../apis';
import { useAppDispatch } from '../../../hooks/redux';
import { toggleUsingItem } from '../../../store/sidebar';

type Props = {
  type: UnionObjectType;
  item: AuthorWithType;
};
const AuthorSectionUsingItem = ({ type, item }: Props): JSX.Element => {
  const dispatch = useAppDispatch();

  const imageUrl = item.profile_image?.thumb_360 || '';
  const imageClass = cx({
    settledAuthorList__imgWrapper: true,
    'settledAuthorList__imgWrapper--noItem': !imageUrl,
  });
  return (
    <li className="settledAuthorList__item" title={item.name}>
      <div
        className={imageClass}
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <button
        className="settledAuthorList__button"
        onClick={() => dispatch(toggleUsingItem({ type, item }))}
        type="button"
      >
        <i className="fas fa-times"></i>
      </button>
    </li>
  );
};

export default AuthorSectionUsingItem;

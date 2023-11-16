import React from 'react';
import cx from 'classnames';

import { useAppDispatch } from '../../../hooks/redux';
import { toggleUsingItem } from '../../../store/sidebar';
import { UnionObject, UnionObjectType } from '../../../apis';
import { getObjectImageUrl, getObjectName, isObjectHasImage } from '../utils';

type Props = {
  type: UnionObjectType;
  item: UnionObject;
};
const OtherOptionItem = ({ type, item }: Props): JSX.Element => {
  const dispatch = useAppDispatch();

  return (
    <li
      className="articleOptionDetailList__item"
      onClick={() => dispatch(toggleUsingItem({ type, item }))}
    >
      <div
        className={cx('articleOptionProperty', {
          'articleOptionProperty--hasImage': isObjectHasImage(item),
        })}
      >
        {isObjectHasImage(item) && (
          <div
            className="articleOptionProperty__imgWrapper"
            style={{
              backgroundImage: `url(${getObjectImageUrl(item)}`,
            }}
          ></div>
        )}
        <p className="articleOptionProperty__title">{getObjectName(item)}</p>
      </div>
    </li>
  );
};

export default OtherOptionItem;

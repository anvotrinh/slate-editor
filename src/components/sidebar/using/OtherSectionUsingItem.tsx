import React from 'react';
import cx from 'classnames';

import { UnionObject, UnionObjectType } from '../../../apis';
import { useAppDispatch } from '../../../hooks/redux';
import { toggleUsingItem } from '../../../store/sidebar';
import { getObjectImageUrl, getObjectName, isObjectHasImage } from '../utils';

type Props = {
  type: UnionObjectType;
  item: UnionObject;
};
const OtherSectionUsingItem = ({ type, item }: Props): JSX.Element => {
  const dispatch = useAppDispatch();

  const containerClass = cx({
    articleOptionProperty: true,
    'articleOptionProperty--settled': true,
    'articleOptionProperty--hasImage': isObjectHasImage(item),
  });
  return (
    <div className={containerClass}>
      {isObjectHasImage(item) && (
        <div
          className="articleOptionProperty__imgWrapper"
          style={{ backgroundImage: `url(${getObjectImageUrl(item)})` }}
        ></div>
      )}
      <p className="articleOptionProperty__title">{getObjectName(item)}</p>
      <button
        className="articleOptionProperty__button js-deleteSettledName"
        onClick={() => dispatch(toggleUsingItem({ type, item }))}
        type="button"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default OtherSectionUsingItem;

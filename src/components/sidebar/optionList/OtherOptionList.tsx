import React from 'react';

import i18n from '../../../utils/i18n';
import { useAppSelector } from '../../../hooks/redux';
import { UnionObjectType } from '../../../apis';
import OtherOptionItem from './OtherOptionItem';

type Props = {
  type: UnionObjectType;
};
const OtherOptionList = ({ type }: Props): JSX.Element => {
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { recent, using } = sidebarState[type];

  const recentWithoutUsing = recent.filter((item) => {
    return using.findIndex((i) => i.id === item.id) === -1;
  });

  return (
    <div className="articleOptionDetail__content">
      <p className="articleOptionDetail__listLabel">
        {type !== 'licensees' ? i18n.get('recent') : i18n.get('all_licensees')}
      </p>
      <div className="articleOptionDetail__list">
        {recentWithoutUsing.length === 0 ? (
          <ul className="articleOptionDetailList">
            <li className="articleOptionDetailList__item articleOptionDetailList__item--isEmpty">
              {i18n.get('not_applicable')}
            </li>
          </ul>
        ) : (
          <ul className="articleOptionDetailList">
            {recentWithoutUsing.map((item) => (
              <OtherOptionItem key={item.id} type={type} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OtherOptionList;

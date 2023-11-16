import React from 'react';

import i18n from '../../../utils/i18n';
import { useAppSelector } from '../../../hooks/redux';
import { UnionObjectType } from '../../../apis';

type Props = {
  type: UnionObjectType;
};
const EmptyContentList = ({ type }: Props): JSX.Element => {
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { isListLoading, viewMoreLastQuery } = sidebarState[type];

  return (
    <ul className="articleOptionMoreList">
      {!isListLoading && (
        <li className="articleOptionMoreList__item articleOptionMoreList__item--noItem">
          {viewMoreLastQuery === '' ? `No ${i18n.get(type)}` : 'No Match'}
        </li>
      )}
    </ul>
  );
};

export default EmptyContentList;

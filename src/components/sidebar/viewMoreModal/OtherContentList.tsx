import React from 'react';

import { useAppSelector } from '../../../hooks/redux';
import { UnionObjectType } from '../../../apis';
import OtherContentListItem from './OtherContentListItem';
import EmptyContentList from './EmptyContentList';

type Props = {
  type: UnionObjectType;
};
const OtherContentList = ({ type }: Props): JSX.Element => {
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { all } = sidebarState[type];

  if (all.length === 0) return <EmptyContentList type={type} />;
  return (
    <ul className="articleOptionMoreList js-articleOptionMoreList">
      {all.map((item) => (
        <OtherContentListItem key={item.id} type={type} item={item} />
      ))}
    </ul>
  );
};

export default OtherContentList;

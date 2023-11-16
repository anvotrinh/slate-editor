import React from 'react';

import { UnionObject, UnionObjectType } from '../../../apis';
import { useAppSelector } from '../../../hooks/redux';
import OtherSectionUsingItem from './OtherSectionUsingItem';

type Props = {
  type: UnionObjectType;
};
const OtherSectionUsing = ({ type }: Props): JSX.Element => {
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { using } = sidebarState[type];

  return (
    <div className="articleOptionDetail__content">
      {using.map((item: UnionObject) => (
        <OtherSectionUsingItem key={item.id} type={type} item={item} />
      ))}
    </div>
  );
};

export default OtherSectionUsing;

import React from 'react';
import { AuthorWithType, UnionObjectType } from '../../../apis';
import { useAppSelector } from '../../../hooks/redux';
import { isObjectHasType } from '../utils';
import AuthorSectionUsingItem from './AuthorSectionUsingItem';

type Props = {
  type: UnionObjectType;
};
const AuthorSectionUsing = ({ type }: Props): JSX.Element => {
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { using } = sidebarState[type];

  const items = using.map((item) => {
    if (!isObjectHasType<AuthorWithType>(item, 'authors')) return null;
    return <AuthorSectionUsingItem key={item.id} type={type} item={item} />;
  });
  return (
    <div className="articleOptionDetail__content">
      <ul className="settledAuthorList">{items}</ul>
    </div>
  );
};

export default AuthorSectionUsing;

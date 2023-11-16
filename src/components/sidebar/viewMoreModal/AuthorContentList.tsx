import React from 'react';

import { useAppSelector } from '../../../hooks/redux';
import { AuthorWithType, UnionObjectType } from '../../../apis';
import { getObjectName, isObjectHasType } from '../utils';
import AuthorContentListItem from './AuthorContentListItem';
import EmptyContentList from './EmptyContentList';

type Props = {
  type: UnionObjectType;
};
const AuthorContentList = ({ type }: Props): JSX.Element => {
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { all, viewMoreLastQuery } = sidebarState[type];

  const searchResult = all.filter((item) =>
    getObjectName(item).toLowerCase().includes(viewMoreLastQuery.toLowerCase())
  );

  if (searchResult.length === 0) return <EmptyContentList type={type} />;
  const items = searchResult.map((item) => {
    if (!isObjectHasType<AuthorWithType>(item, 'authors')) return null;
    return <AuthorContentListItem key={item.id} type={type} item={item} />;
  });
  return (
    <ul className="articleOptionMoreList js-articleOptionMoreList">{items}</ul>
  );
};

export default AuthorContentList;

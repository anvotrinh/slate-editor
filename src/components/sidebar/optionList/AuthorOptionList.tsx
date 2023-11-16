import React from 'react';

import i18n from '../../../utils/i18n';
import { useAppSelector } from '../../../hooks/redux';
import { AuthorWithType, UnionObjectType } from '../../../apis';
import AuthorOptionItem from './AuthorOptionItem';
import { getObjectName, isObjectHasType } from '../utils';

type Props = {
  type: UnionObjectType;
};
const AuthorOptionList = ({ type }: Props): JSX.Element => {
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { all, using, searchInput } = sidebarState.authors;

  let searchResult = all.filter((item) =>
    getObjectName(item).toLowerCase().includes(searchInput.toLowerCase())
  );
  searchResult = searchResult
    .filter((v) => using.findIndex((item) => item.id === v.id) === -1)
    .slice(0, 10);

  if (searchResult.length === 0) {
    return (
      <div className="articleOptionDetail__content">
        <ul className="articleOptionDetailList">
          <li className="articleOptionDetailList__item articleOptionDetailList__item--isEmpty">
            {i18n.get('not_applicable')}
          </li>
        </ul>
      </div>
    );
  }
  return (
    <div className="articleOptionDetail__content">
      <ul className="articleOptionDetailList">
        {searchResult.map((author) => {
          if (!isObjectHasType<AuthorWithType>(author, 'authors')) return null;
          return <AuthorOptionItem key={author.id} type={type} item={author} />;
        })}
      </ul>
    </div>
  );
};

export default AuthorOptionList;

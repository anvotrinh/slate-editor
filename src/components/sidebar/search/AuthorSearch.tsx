import React, { ChangeEvent } from 'react';

import i18n from '../../../utils/i18n';
import { useAppDispatch } from '../../../hooks/redux';
import { setSearchInput } from '../../../store/sidebar';

const AuthorSearch = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const handleOnChangeInputAuthor = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchInput({ type: 'authors', input: event.target.value }));
  };

  return (
    <div className="articleOptionDetail__content">
      <input
        className="articleOptionDetail__inputText Select-control"
        type="text"
        placeholder={i18n.get('search_for_authors')}
        onChange={handleOnChangeInputAuthor}
      />
    </div>
  );
};

export default AuthorSearch;

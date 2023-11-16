import React, { FormEvent } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { UnionObjectType } from '../../../apis';
import {
  applyViewMoreSearchInput,
  listObject,
  setViewMoreSearchInput,
} from '../../../store/sidebar';
import i18n from '../../../utils/i18n';

type Props = {
  type: UnionObjectType;
};
const ModalSearchInput = ({ type }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { viewMoreSearchInput } = sidebarState[type];

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === 'series' || type === 'topics') {
      dispatch(listObject(type));
    } else if (type === 'authors') {
      dispatch(applyViewMoreSearchInput(type));
    }
  };

  return (
    <form
      className="modal-articleOptionMore__header"
      onSubmit={handleSearchSubmit}
    >
      <div className="searchForm">
        <input
          className="searchForm__inputText"
          type="text"
          placeholder={i18n.get(`search_for_${type}`)}
          value={viewMoreSearchInput}
          onChange={(e) =>
            dispatch(setViewMoreSearchInput({ type, input: e.target.value }))
          }
        />
        <button className="searchForm__button" type="submit">
          <i className="fa fa-search" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
};

export default ModalSearchInput;

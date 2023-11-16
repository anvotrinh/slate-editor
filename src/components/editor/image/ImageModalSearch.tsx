import React, { FormEventHandler } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { changeSearchQuery } from '../../../store/image';
import i18n from '../../../utils/i18n';

type Props = {
  onSearch: (shouldReset: boolean) => void;
};

const ImageModalSearch = ({ onSearch }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector((state) => state.image);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSearch(true);
  };

  return (
    <form className="modal-editorImage__search" onSubmit={handleSubmit}>
      <div className="searchForm">
        <input
          className="searchForm__inputText"
          value={searchQuery}
          onChange={(e) => dispatch(changeSearchQuery(e.target.value))}
          type="text"
          placeholder={i18n.get('search_for_images')}
        />
        <button className="searchForm__button" type="submit">
          <i className="fa fa-search" aria-hidden="true"></i>
        </button>
      </div>
    </form>
  );
};

export default ImageModalSearch;

import React, { ChangeEventHandler, KeyboardEventHandler } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  addTag,
  blurTagInput,
  chooseTag,
  deleteTag,
  focusTagInput,
  listTagStat,
  setSelectedSuggestionIndex,
  setTagInputText,
} from '../../../store/publishTag';
import i18n from '../../../utils/i18n';
import {
  getSuggestionDataList,
  getInputErrorText,
  getTagInputError,
} from '../utils';

const TagInput = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const publishTagState = useAppSelector((state) => state.publishTag);
  const {
    selectedTags,
    tagInput,
    selectedSuggestionIndex,
    isSuggestionListHovered,
  } = publishTagState;

  const suggestionDataList = getSuggestionDataList(publishTagState);

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Enter') return;
    if (selectedSuggestionIndex < 0 || isSuggestionListHovered) {
      dispatch(addTag());
      return;
    }
    const suggestionOptionData = suggestionDataList[selectedSuggestionIndex];
    if (!suggestionOptionData) return;
    const { type, tagStat } = suggestionOptionData;
    if (type === 'add') {
      dispatch(addTag());
    } else if (type === 'option' && tagStat) {
      dispatch(chooseTag(tagStat.name));
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Backspace' && !event.currentTarget.value) {
      dispatch(deleteTag());
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (selectedSuggestionIndex <= 0) return;
      dispatch(setSelectedSuggestionIndex(selectedSuggestionIndex - 1));
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (selectedSuggestionIndex >= suggestionDataList.length - 1) return;
      dispatch(setSelectedSuggestionIndex(selectedSuggestionIndex + 1));
    }
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const input = event.target.value;
    dispatch(setTagInputText(input));
    if (input && !getTagInputError(input)) {
      dispatch(listTagStat(input));
    }
  };

  const inputErrorText = getInputErrorText(publishTagState);
  return (
    <div className="modal-editFormList__addLabel">
      <div className="modal-editFormList__selectLabels">
        {selectedTags.map((tag, index) => (
          <span key={index} className="tagProperty tagProperty--settled">
            <p className="tagProperty__title">{tag}</p>
            <button
              className="tagProperty__button"
              onClick={() => dispatch(deleteTag(tag))}
            >
              <i className="fas fa-times tagProperty__button--close" />
            </button>
          </span>
        ))}
      </div>
      <div className="modal-editFormList__inputWrapper">
        {selectedTags.length < 5 && (
          <input
            className="modal-editFormList__inputText modal-editFormList__inputText--label"
            value={tagInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onKeyDown={handleKeyDown}
            onFocus={() => dispatch(focusTagInput())}
            onBlur={() => dispatch(blurTagInput())}
            placeholder={i18n.get('add_tag')}
          />
        )}
        {inputErrorText !== '' && (
          <div className="modal-editFormList__error modal-editFormList__error--suggest">
            <p className="modal-editFormList__text">{inputErrorText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;

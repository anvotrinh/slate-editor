import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  setIsSuggestionListHovered,
  setSelectedSuggestionIndex,
} from '../../../store/publishTag';
import { getSuggestionDataList, getInputErrorText } from '../utils';
import SuggestionOption from './SuggestionOption';

const SuggestionList = (): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const publishTagState = useAppSelector((state) => state.publishTag);

  const suggestionDataList = getSuggestionDataList(publishTagState);
  const inputErrorText = getInputErrorText(publishTagState);
  if (inputErrorText !== '' || suggestionDataList.length === 0) return null;
  return (
    <div className="modal-editFormList__suggest">
      <ul
        className="suggestList"
        onMouseEnter={() => dispatch(setIsSuggestionListHovered(true))}
        onMouseLeave={() => {
          dispatch(setIsSuggestionListHovered(false));
          dispatch(setSelectedSuggestionIndex(-1));
        }}
      >
        {suggestionDataList.map((suggestionData, i) => (
          <SuggestionOption key={i} index={i} {...suggestionData} />
        ))}
      </ul>
    </div>
  );
};

export default SuggestionList;

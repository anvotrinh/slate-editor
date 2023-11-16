import React from 'react';
import cx from 'classnames';
import i18n from '../../../utils/i18n';
import { TagStat } from '../../../apis';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { addTag, chooseTag } from '../../../store/publishTag';

type SuggestionOptionType = 'loading' | 'add' | 'option';
type Props = {
  index: number;
  type: SuggestionOptionType;
  tagStat?: TagStat;
};
export type SuggestionData = Omit<Props, 'index'>;
// Note: As soon as you click on the Suggestion Option, the blur event of
// the input tag that hides the Suggestion Tag will fire. Therefore,
// depending on the timing, the click event of the Suggestion Tag may
// fail to fire. To prevent this problem, use the onMouseDown event
// instead of the onClick event for the Suggestion Tag.
const SuggestionOption = ({ index, type, tagStat }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { tagInput, selectedSuggestionIndex, isSuggestionListHovered } =
    useAppSelector((state) => state.publishTag);

  const handleMouseDown = () => {
    if (type === 'add') {
      dispatch(addTag());
    } else if (type === 'option' && tagStat) {
      dispatch(chooseTag(tagStat.name));
    }
  };

  let text = '';
  switch (type) {
    case 'loading':
      text = i18n.get('loading');
      break;
    case 'add':
      text = `${i18n.get('add')}: ${tagInput}`;
      break;
    case 'option':
      text = tagStat?.name || '';
      break;
    default:
      break;
  }
  const isSelected =
    !isSuggestionListHovered && selectedSuggestionIndex === index;
  const itemClassName = cx({
    suggestList__item: true,
    'suggestList__item--selected': isSelected,
  });
  const textClassName = cx({
    suggestList__text: true,
    'suggestList__text--noTag': !tagStat,
  });
  return (
    <li className={itemClassName} onMouseDown={handleMouseDown}>
      <span className={textClassName}>{text}</span>
      {tagStat && (
        <span className="suggestList__counts">
          {tagStat.post_count}
          {tagStat.post_count > 1
            ? i18n.get('count_times')
            : i18n.get('count_time')}
        </span>
      )}
    </li>
  );
};

export default SuggestionOption;

import moment from 'moment';
import { ExpireOption, PublishOption } from '../../store/post';
import { PublishTagState } from '../../store/publishTag';
import { getPostDisplayState } from '../../utils/common';
import { initialPost, unit } from '../../utils/const';
import {
  formatDate,
  getISONow,
  isUnlimitedDate,
  isZeroDate,
} from '../../utils/date';
import i18n from '../../utils/i18n';
import { SuggestionData } from './publishTag/SuggestionOption';

type SubmitType = 'schedule' | 'publish' | 'update';
export const getSubmitType = (
  publishOption: PublishOption,
  publishedAt: string,
  expireOption: ExpireOption,
  expiredAt: string
): SubmitType => {
  const postDisplayState = getPostDisplayState(initialPost);
  const now = moment();
  if (postDisplayState === 'new') {
    if (
      publishOption !== 'current_time' &&
      publishedAt !== '' &&
      moment(publishedAt) > now
    ) {
      return 'schedule';
    }
    return 'publish';
  }
  if (
    (postDisplayState === 'expired' ||
      postDisplayState === 'private' ||
      postDisplayState === 'publishing') &&
    (publishOption === 'current_time' ||
      (publishedAt !== '' && moment(publishedAt) < now)) &&
    (expireOption === 'no_date' ||
      (expiredAt !== '' && moment(expiredAt) > now))
  ) {
    return 'publish';
  }
  return 'update';
};

// This function returns true for some disallowed characters.
// (e.g. spaces, bullets, uppercase English, hald-width kana,
// full-width alphanumeric etc.)
// To make it easier for users to enter tags, these characters
// will be normalized automatically after the input is complete.
export const isValidTag = (tag: string): boolean => {
  // eslint-disable-next-line no-irregular-whitespace
  return RegExp(/^[\p{L}\p{N}\p{M} 　・]*$/, 'u').test(tag);
};
export const getTagInputError = (input: string): string => {
  if (input.length >= 25) {
    return i18n.get('tag_over_characters_error');
  }
  if (!isValidTag(input)) {
    return i18n.get('tag_unavailable_characters_error');
  }
  return '';
};

export const normalizeTag = (tag: string): string => {
  if (tag === '') return '';
  const lower = tag.normalize('NFKC').toLowerCase();
  const validChars = RegExp(/^[\p{L}\p{N}\p{M}]*$/, 'u');
  let res = '';
  for (const c of lower.split('')) {
    if (validChars.test(c)) {
      res += c;
    }
  }
  return res.length <= 25 ? res : '';
};

export const normalizeTags = (tags: string[]): string[] => {
  const res: string[] = [];
  for (const tag of tags) {
    const nTag = normalizeTag(tag);
    if (nTag === '' || res.includes(nTag)) {
      continue;
    }
    res.push(nTag);
  }
  return res.slice(0, 5);
};

export const getSuggestionDataList = (
  state: PublishTagState
): SuggestionData[] => {
  const {
    selectedTags,
    tagInput,
    tagInputError,
    suggestionTagStats,
    isSuggestLoading,
    isFocusTagInput,
  } = state;
  if (selectedTags.length >= 5 || tagInputError) return [];
  const list: SuggestionData[] = [];
  if (isSuggestLoading) {
    list.push({ type: 'loading' });
  }
  if (
    !isSuggestLoading &&
    isFocusTagInput &&
    tagInput &&
    selectedTags.every((tag) => tag !== tagInput) &&
    suggestionTagStats.every((t) => t.name !== tagInput)
  ) {
    list.push({ type: 'add' });
  }
  const filteredSuggestionStatTags = suggestionTagStats.filter(
    (v) => !selectedTags.includes(v.name)
  );
  filteredSuggestionStatTags.forEach((tagStat) => {
    list.push({ type: 'option', tagStat });
  });
  return list;
};

export const getInputErrorText = (state: PublishTagState): string => {
  const suggestionDataList = getSuggestionDataList(state);
  const isNoOption = suggestionDataList.length === 0 && state.tagInput !== '';
  return isNoOption ? i18n.get('no_options') : state.tagInputError;
};

type DatePickerDefaultData = {
  value: string;
  text: string;
};
export const getExpireDatePickerDefaultData = (
  expiredAt: string
): DatePickerDefaultData => {
  const isNotSelectedDate = isZeroDate(expiredAt) || isUnlimitedDate(expiredAt);
  const value = isNotSelectedDate ? getISONow() : expiredAt;
  const text = isNotSelectedDate
    ? i18n.get('schedule_to_expire')
    : formatDate(value, unit.timezone);
  return { value, text };
};
export const getPublishDatePickerDefaultData = (
  publishedAt: string
): DatePickerDefaultData => {
  const value = isZeroDate(publishedAt) ? getISONow() : publishedAt;
  const text = isZeroDate(publishedAt)
    ? i18n.get('schedule_to_publish')
    : formatDate(value, unit.timezone);
  return { value, text };
};

import React, { useRef } from 'react';

import RadioGroup from '../radio/RadioGroup';
import i18n from '../../utils/i18n';
import RadioInput from '../radio/RadioInput';
import DatePicker, { DatePickerRef } from '../datePicker';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  PublishOption,
  setPostPublishedAt,
  setPublishOption,
} from '../../store/post';
import { getPublishDatePickerDefaultData } from './utils';

const PublishSettingPublishDate = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { post, publishOption } = useAppSelector((state) => state.post);
  const datePickerRef = useRef<DatePickerRef>(null);
  const { published_at: publishedAt } = post;
  const defaultValue = useRef<string>(
    getPublishDatePickerDefaultData(publishedAt).value
  );
  const defaultText = useRef<string>(
    getPublishDatePickerDefaultData(publishedAt).text
  );

  const handleOptionChange = (option: string) => {
    dispatch(setPublishOption(option as PublishOption));
  };

  return (
    <RadioGroup
      className="setExpiryDate setExpiryDate--column"
      name="publishDate"
      inputClassName="setExpiryDate__inputRadio"
      labelClassName="setExpiryDate__label setExpiryDate__label--column"
      value={publishOption}
      onChange={handleOptionChange}
    >
      <RadioInput value="current_time">
        <span>{i18n.get('current_date_and_time')}</span>
      </RadioInput>
      <RadioInput
        value="select_date"
        onSelect={() => datePickerRef.current?.focusInput()}
      >
        <div className="setExpiryDate__calendarForm">
          <DatePicker
            ref={datePickerRef}
            defaultValue={defaultValue.current}
            defaultText={defaultText.current}
            onChange={(date) => dispatch(setPostPublishedAt(date))}
          />
        </div>
      </RadioInput>
    </RadioGroup>
  );
};

export default PublishSettingPublishDate;

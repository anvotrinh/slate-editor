import React, { useRef } from 'react';

import RadioGroup from '../radio/RadioGroup';
import RadioInput from '../radio/RadioInput';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  ExpireOption,
  setExpireOption,
  setPostExpiredAt,
} from '../../store/post';
import i18n from '../../utils/i18n';
import { unit } from '../../utils/const';
import DatePicker, { DatePickerRef } from '../datePicker';
import { isZeroDate } from '../../utils/date';
import { getExpireDatePickerDefaultData } from './utils';

declare global {
  function sprintf(value: string, repl: number): string;
}

const PublishSettingExpireDate = (): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const { post, expireOption } = useAppSelector((state) => state.post);
  const datePickerRef = useRef<DatePickerRef>(null);
  const { expired_at: expiredAt, published_at: publishedAt } = post;
  const { default_post_expire_days: defaultPostExpireDays } = unit;
  const defaultValue = useRef<string>(
    getExpireDatePickerDefaultData(expiredAt).value
  );
  const defaultText = useRef<string>(
    getExpireDatePickerDefaultData(expiredAt).text
  );

  const onOptionChange = (option: string) => {
    dispatch(setExpireOption(option as ExpireOption));
  };

  const minDate = isZeroDate(publishedAt) ? undefined : new Date(publishedAt);
  return (
    <RadioGroup
      className="setExpiryDate setExpiryDate--column"
      name="expireDate"
      inputClassName="setExpiryDate__inputRadio"
      labelClassName="setExpiryDate__label setExpiryDate__label--column"
      value={expireOption}
      onChange={onOptionChange}
    >
      <RadioInput value="no_date">
        <span>{i18n.get('no_expiry_date')}</span>
      </RadioInput>
      {defaultPostExpireDays > 0 ? (
        <RadioInput value="unit_default">
          <span>
            {sprintf(i18n.get('days_after_publish'), defaultPostExpireDays)}
          </span>
        </RadioInput>
      ) : (
        <></>
      )}
      <RadioInput
        value="select_date"
        onSelect={() => datePickerRef.current?.focusInput()}
      >
        <div className="setExpiryDate__calendarForm">
          <DatePicker
            ref={datePickerRef}
            defaultValue={defaultValue.current}
            defaultText={defaultText.current}
            minDate={minDate}
            onChange={(date) => dispatch(setPostExpiredAt(date))}
          />
        </div>
      </RadioInput>
    </RadioGroup>
  );
};

export default PublishSettingExpireDate;

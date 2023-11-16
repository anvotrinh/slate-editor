import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import moment from 'moment';

import { unit } from '../../utils/const';
import { formatDate, isZeroDate, toISOTimeString } from '../../utils/date';

// TODO covert jquery, use npm instead
export type DateTimePickerOptions = {
  dateFormat: string;
  controlType: string;
  showButtonPanel?: boolean;
  onSelect?: (date: string) => void;
  beforeShow?: () => void;
  afterInject?: () => void;
  onChangeMonthYear?: () => void;
  minDate?: Date;
  minDateTime?: Date;
  changeMonth?: boolean;
  changeYear?: boolean;
  yearRange?: string;
};
type JqueryCreateOption = {
  text: string;
  class: string;
  click: () => void;
};
type JqueryObject = {
  datetimepicker(options: DateTimePickerOptions): void;
  datetimepicker(method: string, options: Partial<DateTimePickerOptions>): void;
  datetimepicker(formatDate: string, value: string): void;
  datetimepicker(method: string): void;
  datepicker(method: string): {
    find(className: string): JqueryObject;
  };
  val(): string;
  val(value: string): void;
  css(propName: string, propValue: number): void;
  find(className: string): JqueryObject;
  append(element: JqueryObject): JqueryObject;
  length: number;
  removeClass(className: string): void;
};
declare global {
  function $(dom: HTMLInputElement | string | null): JqueryObject;

  function $(
    dom: HTMLInputElement | string | null,
    { text }: JqueryCreateOption
  ): JqueryObject;
}

type Props = {
  defaultValue: string;
  defaultText: string;
  minDate?: Date;
  onChange: (date: string) => void;
};
export type DatePickerRef = {
  focusInput: () => void;
};
const DatePicker = (
  { defaultValue, defaultText, minDate, onChange }: Props,
  ref: Ref<DatePickerRef>
): JSX.Element => {
  const prevMinDate = useRef<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(
    ref,
    (): DatePickerRef => ({
      focusInput: (): void => inputRef.current?.focus(),
    })
  );

  useEffect(() => {
    if (!minDate) return;
    if (
      prevMinDate.current &&
      minDate.getTime() === prevMinDate.current.getTime()
    ) {
      prevMinDate.current = minDate;
      return;
    }
    prevMinDate.current = minDate;

    const $input = $(inputRef.current);
    const isDefaultText = $input.val() === defaultText;
    if (isDefaultText) {
      $input.val(formatDate(defaultValue));
    }
    $input.datetimepicker('option', { minDate, minDateTime: minDate });
    if (isDefaultText) {
      $input.val(defaultText);
    } else {
      onChange(toISOTimeString($input.val()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate]);

  useEffect(() => {
    const $input = $(inputRef.current);
    const dateTimePickerOptions: DateTimePickerOptions = {
      dateFormat: 'yy-mm-dd',
      controlType: 'select',
      showButtonPanel: true,
      onSelect: (date) => onChange(toISOTimeString(date)),
      beforeShow,
      afterInject: initResetButton,
      onChangeMonthYear: initResetButton,
      changeMonth: true,
      changeYear: true,
      yearRange: 'c-5:c+5',
    };
    if (minDate) {
      const unitTimezone = unit.timezone || 'UTC';
      const minDateOption = new Date(
        (moment().tz(unitTimezone).utcOffset() + minDate.getTimezoneOffset()) *
          60000 +
          minDate.getTime()
      );
      dateTimePickerOptions.minDate = minDateOption;
      dateTimePickerOptions.minDateTime = minDateOption;
    }
    $input.datetimepicker(dateTimePickerOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beforeShow = () => {
    const $input = $(inputRef.current);
    if ($input.val() === defaultText && !isZeroDate(defaultValue)) {
      $input.val(formatDate(defaultValue, unit.timezone));
      $input.datetimepicker('setDate', formatDate(defaultValue, unit.timezone));
      onChange(toISOTimeString($input.val()));
    }
    setTimeout(() => {
      $('.ui-datepicker').css('z-index', 9999);
    }, 10);
  };

  const initResetButton = () => {
    const $input = $(inputRef.current);
    const $buttonPane = $input
      .datepicker('widget')
      .find('.ui-datepicker-buttonpane');
    // Check if there is already a reset button
    if ($buttonPane.find('.js-reset').length) {
      return;
    }
    $buttonPane.append(
      $('<button>', {
        text: 'Reset',
        class:
          'ui-datepicker-current ui-state-default ui-priority-primary ui-corner-all js-reset',
        click: () => {
          $input.datetimepicker('hide');
          $input.val(defaultText);
          onChange(defaultValue);
        },
      })
    );

    $buttonPane.find('button').removeClass('ui-priority-secondary');
  };

  return (
    <div className="calendarForm">
      <input
        type="text"
        className="calendarForm__inputText"
        ref={inputRef}
        defaultValue={defaultText}
        readOnly
        onClick={(e) => e.preventDefault()}
      />
      <button
        className="calendarForm__button calendarForm__button--noEvent"
        type="submit"
      >
        <i className="fa fa-calendar" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default forwardRef(DatePicker);

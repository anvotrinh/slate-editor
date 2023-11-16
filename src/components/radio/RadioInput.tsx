import React, { useContext } from 'react';
import { GroupContext } from './RadioGroup';

type InputProps = {
  value: string;
  onSelect?: () => void;
  children: JSX.Element;
};
const RadioInput = ({ value, children, onSelect }: InputProps): JSX.Element => {
  const groupContext = useContext(GroupContext);
  const inputId = `${groupContext.name}${value}`;

  const handleInputChange = () => {
    if (onSelect) {
      onSelect();
    }
    if (groupContext.onChange) {
      groupContext.onChange(value);
    }
  };
  return (
    <div>
      <input
        type="radio"
        className={groupContext.inputClassName}
        checked={value === groupContext.radioValue}
        id={inputId}
        name={groupContext.name}
        value={value}
        onChange={handleInputChange}
      />
      <label className={groupContext.labelClassName} htmlFor={inputId}>
        {children}
      </label>
    </div>
  );
};

export default RadioInput;

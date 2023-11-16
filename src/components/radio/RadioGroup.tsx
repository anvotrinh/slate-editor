import React from 'react';

type GroupContextType = {
  name: string;
  inputClassName: string;
  labelClassName: string;
  radioValue: string;
  onChange?: (option: string) => void;
};

const initialGroupContext: GroupContextType = {
  inputClassName: '',
  labelClassName: '',
  name: '',
  radioValue: '',
};

export const GroupContext =
  React.createContext<GroupContextType>(initialGroupContext);
export const GroupProvider = GroupContext.Provider;

type GroupProps = {
  className: string;
  name: string;
  inputClassName: string;
  labelClassName: string;
  value: string;
  onChange: (option: string) => void;
  children: JSX.Element[];
};

const RadioGroup = (props: GroupProps): JSX.Element => {
  return (
    <GroupProvider value={{ ...props, radioValue: props.value }}>
      <div className={props.className}>{props.children}</div>
    </GroupProvider>
  );
};

export default RadioGroup;

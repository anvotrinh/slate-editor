import React, { MouseEventHandler } from 'react';
import cx from 'classnames';

type Props = {
  onMouseDown: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
};

const ToolbarButton = ({
  children,
  onMouseDown,
  disabled = false,
  label,
}: Props): JSX.Element => {
  const buttonClass = cx({
    editorToolList__button: true,
    'editorToolList__button--disabled': disabled,
  });
  return (
    <li className="editorToolList__item">
      <button
        className={buttonClass}
        disabled={disabled}
        onMouseDown={onMouseDown}
        title={label}
      >
        {children}
      </button>
    </li>
  );
};

export default ToolbarButton;

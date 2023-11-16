import React from 'react';
import cx from 'classnames';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setCodeModalLanguage } from '../../../store/modal';

type Props = {
  id: string;
  label: string;
};

const CodeLanguageModalButton = ({ id, label }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { codeModalLanguage } = useAppSelector((state) => state.modal);

  const buttonClass = cx({
    editor__buttonSelectLanguage: true,
    'editor__buttonSelectLanguage--active': id === codeModalLanguage,
  });
  return (
    <button
      className={buttonClass}
      onClick={() => dispatch(setCodeModalLanguage(id))}
    >
      {label}
    </button>
  );
};

export default CodeLanguageModalButton;

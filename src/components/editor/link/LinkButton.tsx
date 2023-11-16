import React from 'react';
import { FaLink } from 'react-icons/fa';

import ToolbarButton from '../toolbar/ToolbarButton';
import { useAppDispatch } from '../../../hooks/redux';
import { openLinkModal } from '../../../store/modal';

const LinkButton = (): JSX.Element => {
  const dispatch = useAppDispatch();

  return (
    <ToolbarButton onMouseDown={() => dispatch(openLinkModal())} label="Link">
      <FaLink />
    </ToolbarButton>
  );
};

export default LinkButton;

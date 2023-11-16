import React from 'react';
import { useSlate } from 'slate-react';
import { FaImage } from 'react-icons/fa';

import ToolbarButton from '../toolbar/ToolbarButton';
import { openImageModal } from '../../../store/modal';
import { useAppDispatch } from '../../../hooks/redux';
import { isBlockActive } from '../../../utils/block';
import { setSingleMode } from '../../../store/image';
import i18n from '../../../utils/i18n';

const ImageButton = (): JSX.Element => {
  const editor = useSlate();
  const dispatch = useAppDispatch();

  return (
    <ToolbarButton
      disabled={isBlockActive(editor, 'footnote')}
      onMouseDown={() => {
        dispatch(setSingleMode(false));
        dispatch(openImageModal());
      }}
      label={i18n.get('image')}
    >
      <FaImage />
    </ToolbarButton>
  );
};

export default ImageButton;

import React from 'react';

import { useAppDispatch } from '../../hooks/redux';
import { openGoPrivateModal } from '../../store/modal';
import { setNotifyCurator } from '../../store/post';
import { getPostDisplayState } from '../../utils/common';
import { initialPost } from '../../utils/const';
import i18n from '../../utils/i18n';

const HeaderGoPrivate = (): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const initialPostState = getPostDisplayState(initialPost);

  const handleGoPrivateClick = () => {
    dispatch(setNotifyCurator(false));
    dispatch(openGoPrivateModal());
  };

  if (initialPostState !== 'published') return null;
  return (
    <div className="mainHeader__goPrivate" onClick={handleGoPrivateClick}>
      {i18n.get('go_private')}
    </div>
  );
};

export default HeaderGoPrivate;

import React, { useEffect } from 'react';

import { UnionObjectType } from '../../../apis';
import { useAppDispatch } from '../../../hooks/redux';
import { listObject, recentObjects } from '../../../store/sidebar';
import AuthorOptionList from './AuthorOptionList';
import OtherOptionList from './OtherOptionList';

type Props = {
  type: UnionObjectType;
};
const SidebarSectionOptionList = ({ type }: Props): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (type === 'series' || type === 'topics') {
      dispatch(recentObjects(type));
    } else if (type === 'authors') {
      dispatch(listObject(type));
    }
  }, [type, dispatch]);

  if (type === 'authors') return <AuthorOptionList type={type} />;
  return <OtherOptionList type={type} />;
};

export default SidebarSectionOptionList;

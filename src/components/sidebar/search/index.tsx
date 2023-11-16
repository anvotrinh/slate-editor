import React from 'react';

import { UnionObjectType } from '../../../apis';
import AuthorSearch from './AuthorSearch';
import OtherSearch from './OtherSearch';

type Props = {
  type: UnionObjectType;
};
const SidebarSectionSearch = ({ type }: Props): JSX.Element => {
  if (type === 'authors') return <AuthorSearch />;
  return <OtherSearch type={type} />;
};

export default SidebarSectionSearch;

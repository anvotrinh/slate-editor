import React from 'react';

import { UnionObjectType } from '../../../apis';
import AuthorSectionUsing from './AuthorSectionUsing';
import OtherSectionUsing from './OtherSectionUsing';

type Props = {
  type: UnionObjectType;
};
const SidebarSectionUsing = ({ type }: Props): JSX.Element => {
  if (type === 'authors') return <AuthorSectionUsing type={type} />;
  return <OtherSectionUsing type={type} />;
};

export default SidebarSectionUsing;

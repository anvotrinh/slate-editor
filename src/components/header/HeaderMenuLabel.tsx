import React from 'react';
import cx from 'classnames';

import i18n from '../../utils/i18n';
import { getPostDisplayState } from '../../utils/common';
import { initialPost } from '../../utils/const';
import { useAppSelector } from '../../hooks/redux';

const labelMap: Record<string, string> = {
  new: i18n.get('new'),
  published: i18n.get('public'),
  publishing: i18n.get('reserved'),
  draft: i18n.get('draft'),
  private: i18n.get('private'),
  expired: i18n.get('expired'),
};
const classNameMap: Record<string, string> = {
  new: '',
  published: 'statusLabel--1 statusLabel--newPost',
  publishing: 'statusLabel--2',
  draft: 'statusLabel--5',
  private: 'statusLabel--3',
  expired: 'statusLabel--4',
};

const HeaderMenuLabel = (): JSX.Element => {
  const { post } = useAppSelector((state) => state.post);

  const initialPostState = getPostDisplayState(initialPost);
  const postState = getPostDisplayState(post);

  let label = labelMap[postState];
  let className = classNameMap[postState];
  if (initialPostState === 'publishing') {
    label = labelMap[initialPostState];
    className = classNameMap[initialPostState];
  }
  return <p className={cx('statusLabel', className)}>{label}</p>;
};

export default HeaderMenuLabel;

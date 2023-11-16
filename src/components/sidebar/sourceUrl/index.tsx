import React from 'react';
import cx from 'classnames';

import i18n from '../../../utils/i18n';
import SidebarSectionSwitcher from '../switcher';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setIsSourceUrlActive, setPostSourceUrl } from '../../../store/post';

const SidebarSourceURL = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { post, isSourceUrlActive } = useAppSelector((state) => state.post);

  const detailClassName = cx({
    articleOptionList__detail: true,
    expand: isSourceUrlActive,
  });
  return (
    <li className="articleOptionList__item js-articleOptionDetail">
      <SidebarSectionSwitcher
        isActive={isSourceUrlActive}
        type="source_url"
        onToggle={(isActive) => dispatch(setIsSourceUrlActive(isActive))}
      />
      <div className={detailClassName}>
        <div className="articleOptionDetail">
          <div className="articleOptionDetail__content">
            <input
              className="articleOptionDetail__inputText Select-control"
              type="text"
              placeholder={i18n.get('source_url_placeholder')}
              value={post.source_url}
              onChange={(e) => dispatch(setPostSourceUrl(e.target.value))}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default SidebarSourceURL;

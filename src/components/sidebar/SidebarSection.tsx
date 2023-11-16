import React from 'react';
import cx from 'classnames';

import i18n from '../../utils/i18n';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import SidebarSectionUsing from './using';
import SidebarSectionSwitcher from './switcher';
import SidebarSectionSearch from './search';
import SidebarSectionViewMoreModal from './viewMoreModal';
import { UnionObjectType } from '../../apis';
import CreateSeriesModal from './createSeriesModal';
import SidebarSectionOptionList from './optionList';
import { openViewMoreModal, setIsActive } from '../../store/sidebar';

type Props = {
  type: UnionObjectType;
};
const SidebarSection = ({ type }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const sidebarSection = useAppSelector((state) => state.sidebar);
  const { isActive } = sidebarSection[type];

  const handleSwitcherToggle = (isActive: boolean) => {
    dispatch(setIsActive({ type, isActive }));
  };

  const containerClass = cx({
    'js-articleOptionDetail': true,
    articleOptionList__item: true,
    'articleOptionList__item--margin': type === 'licensees',
  });
  const contentClass = cx({
    articleOptionList__detail: true,
    expand: isActive,
  });
  return (
    <li className={containerClass}>
      <SidebarSectionSwitcher
        type={type}
        isActive={isActive}
        onToggle={handleSwitcherToggle}
      />
      <div className={contentClass}>
        <div className="articleOptionDetail">
          <SidebarSectionUsing type={type} />
          {type !== 'licensees' && <SidebarSectionSearch type={type} />}
          <SidebarSectionOptionList type={type} />
          {type !== 'licensees' && (
            <div className="articleOptionDetail__more">
              <button
                className="articleOptionDetail__button"
                type="button"
                onClick={() => dispatch(openViewMoreModal(type))}
              >
                {i18n.get('view_all')}
              </button>
            </div>
          )}
          <SidebarSectionViewMoreModal type={type} />
          {type === 'series' && <CreateSeriesModal />}
        </div>
      </div>
    </li>
  );
};

export default SidebarSection;

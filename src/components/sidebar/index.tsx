import React from 'react';

import i18n from '../../utils/i18n';
import { chLicensees, unit, unitId } from '../../utils/const';
import SidebarSection from './SidebarSection';
import SidebarSourceURL from './sourceUrl';

const Sidebar = (): JSX.Element => {
  return (
    <aside className="leftBar">
      <div className="leftBar__header">
        <a className="leftBar__back" href={`/cms/ch/${unitId}/posts`}>
          {i18n.get('stories')}
        </a>
      </div>
      <h1 className="leftBar__unitTitle leftBar__unitTitle--ch">{unit.name}</h1>
      <div className="leftBar__content">
        <ul className="articleOptionList">
          <SidebarSection type="series" />
          <SidebarSection type="topics" />
          <SidebarSection type="authors" />
          <SidebarSourceURL />
          {chLicensees.length !== 0 && <SidebarSection type="licensees" />}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

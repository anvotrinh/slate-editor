import React from 'react';
import cx from 'classnames';

import { UnionObjectType } from '../../../apis';
import i18n from '../../../utils/i18n';

type Props = {
  type: UnionObjectType | 'source_url';
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
};
const SidebarSectionSwitcher = ({
  type,
  isActive,
  onToggle,
}: Props): JSX.Element => {
  const label = i18n.get(type);
  const containerClassName = cx('articleOptionList__label', {
    settled: isActive,
  });
  return (
    <div className={containerClassName}>
      <p className="articleOptionList__title">{label}</p>
      <div className="articleOptionList__switch js-onOffSwitch">
        <div className="onOffSwitch">
          <input
            className="onOffSwitch__checkbox"
            type="checkbox"
            id={type}
            checked={isActive}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <label className="onOffSwitch__label" htmlFor={type}></label>
        </div>
      </div>
    </div>
  );
};

export default SidebarSectionSwitcher;

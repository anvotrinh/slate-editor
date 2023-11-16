import React, { ChangeEventHandler } from 'react';
import { useSlate } from 'slate-react';

import i18n from '../../../utils/i18n';
import { ElementType } from '../Element';
import {
  focusAndToggleBlock,
  getCurrentBlockTypeInList,
  isBlockActive,
} from '../../../utils/block';

type DropdownOption = {
  label: string;
  type: ElementType;
};
const options: DropdownOption[] = [
  { label: i18n.get('paragraph'), type: 'paragraph' },
  { label: i18n.get('heading_1'), type: 'heading-one' },
  { label: i18n.get('heading_2'), type: 'heading-two' },
  { label: i18n.get('heading_3'), type: 'heading-three' },
  { label: i18n.get('heading_4'), type: 'heading-four' },
  { label: i18n.get('heading_5'), type: 'heading-five' },
  { label: i18n.get('heading_6'), type: 'heading-six' },
  { label: i18n.get('preformatted'), type: 'preformatted' },
];

const dropdownTypes = options.map((option) => option.type);

const ParagraphDropdown = (): JSX.Element => {
  const editor = useSlate();
  const handleSelectChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    focusAndToggleBlock(editor, event.target.value as ElementType);
  };
  const currentBlockType = getCurrentBlockTypeInList(editor, dropdownTypes);
  return (
    <li className="editorToolList__item editorToolList__item--paragraph">
      <div className="editorToolList__paragraphStyle">
        <div className="selectForm">
          <select
            disabled={isBlockActive(editor, 'footnote')}
            className="selectForm__select"
            onChange={handleSelectChange}
            value={currentBlockType}
          >
            {options.map(({ type, label }) => (
              <option className="selectForm__option" key={type} value={type}>
                {label}
              </option>
            ))}
          </select>
          <p className="selectForm__selectArrow">
            <i className="fa fa-caret-down" aria-hidden="true"></i>
          </p>
        </div>
      </div>
    </li>
  );
};

export default ParagraphDropdown;

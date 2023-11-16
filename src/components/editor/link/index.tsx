import React from 'react';
import { RenderElementProps, useFocused, useSlate } from 'slate-react';

import { CustomText } from '../Leaf';
import { unwrapLink } from '../../../utils/link';
import { useAppDispatch } from '../../../hooks/redux';
import { openLinkModal } from '../../../store/modal';
import i18n from '../../../utils/i18n';
import InlineChromiumBugfix from './InlineChromiumBugfix';
import { isElementHasType, isElementSelected } from '../../../utils/element';

const Link = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element | null => {
  const editor = useSlate();
  const dispatch = useAppDispatch();
  const isSelected = isElementSelected(editor, element);
  const isFocused = useFocused();
  if (!isElementHasType<LinkElement>(element, 'link')) return null;

  const handleEditClick = () => {
    dispatch(openLinkModal({ linkElement: element }));
  };

  const handleUnlinkClick = () => {
    unwrapLink(editor);
  };

  const menuStyle = {
    display: isSelected && isFocused ? '' : 'none',
    fontWeight: 300,
  };
  return (
    <span className="js-editorEditLink" {...attributes}>
      <a className="ma__a" href={element.url}>
        <InlineChromiumBugfix />
        {children}
        <InlineChromiumBugfix />
      </a>
      <span className="menu" style={menuStyle} contentEditable={false}>
        <span className="menuItem" onClick={handleEditClick}>
          {i18n.get('edit')}
        </span>
        <span className="menuItem" onClick={handleUnlinkClick}>
          {i18n.get('unlink')}
        </span>
      </span>
    </span>
  );
};

export type LinkElement = {
  type: 'link';
  url: string;
  children: CustomText[];
};

export default Link;

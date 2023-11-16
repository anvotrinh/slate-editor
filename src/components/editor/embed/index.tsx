import React from 'react';
import { RenderElementProps, useFocused, useSlate } from 'slate-react';

import { CustomText } from '../Leaf';
import { isEmbedElement } from '../../../utils/embed';
import EmbedContent from './EmbedContent';
import { isElementSelected } from '../../../utils/element';

const Embed = ({
  element,
  ...otherProps
}: RenderElementProps): JSX.Element | null => {
  const editor = useSlate();
  const isSelected = isElementSelected(editor, element);
  const isFocused = useFocused();

  if (!isEmbedElement(element)) return null;
  return (
    <EmbedContent
      element={element}
      isSelectedAndFocused={isSelected && isFocused}
      {...otherProps}
    />
  );
};

export type EmbedElement = {
  type:
    | 'video'
    | 'embed-youtube'
    | 'embed-vimeo'
    | 'embed-spotify'
    | 'embed-twitter'
    | 'embed-instagram'
    | 'embed-facebook'
    | 'embed-brightcove'
    | 'embed-page';
  url: string;
  attrsSrc: string;
  children: CustomText[];
};

export default Embed;

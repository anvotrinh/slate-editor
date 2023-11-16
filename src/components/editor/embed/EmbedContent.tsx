import React, { useEffect, useRef } from 'react';
import { RenderElementProps, useSlateStatic } from 'slate-react';
import cx from 'classnames';
import { FaTrashAlt } from 'react-icons/fa';

import { removeEmbed } from '../../../utils/embed';
import InnerEmbedContent from './InnerEmbedContent';
import { EmbedElement } from '.';

type Props = Partial<RenderElementProps> & {
  element: EmbedElement;
  isSelectedAndFocused?: boolean;
};

const EmbedContent = ({
  element,
  isSelectedAndFocused = false,
  attributes,
  children,
}: Props): JSX.Element => {
  const editor = useSlateStatic();
  const embedElm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    switch (element.type) {
      case 'embed-twitter':
        if (window.twttr && embedElm.current) {
          window.twttr.widgets.load(embedElm.current);
        }
        break;
      case 'embed-instagram':
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
        break;
      case 'embed-facebook':
        if (window.FB && embedElm.current) {
          window.FB.XFBML.parse(embedElm.current);
        }
        break;
      default:
        break;
    }
  }, [element.type]);

  const btnStyle = isSelectedAndFocused ? {} : { display: 'none' };
  const containerClass = cx({
    ma__exEmbedWrapper: true,
    'js-editorEditImage': true,
    'ma__exEmbedWrapper--facebook': element.type === 'embed-facebook',
    'ma__exEmbedWrapper--spotify': element.type === 'embed-spotify',
  });
  const embedClass = cx({
    embed: true,
    editing: isSelectedAndFocused,
  });
  return (
    <div className={containerClass} {...attributes}>
      {children}
      <div className={embedClass} ref={embedElm}>
        <InnerEmbedContent element={element} />
      </div>
      <div className="deleteButton" style={btnStyle}>
        <button
          className="menuItem"
          type="button"
          onClick={() => removeEmbed(editor, element)}
        >
          <FaTrashAlt aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default EmbedContent;

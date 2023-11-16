import React from 'react';
import { RenderElementProps } from 'slate-react';
import cx from 'classnames';
import { Descendant } from 'slate';

import { useAppDispatch } from '../../../hooks/redux';
import { openBlockQuoteCiteModal } from '../../../store/modal';
import { isElementHasType } from '../../../utils/element';

const BlockQuote = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element | null => {
  const dispatch = useAppDispatch();
  if (!isElementHasType<BlockQuoteElement>(element, 'blockquote')) return null;
  const caption = element.caption || 'Click to add a reference';
  const citeClassName = cx({
    maBlockquote__cite: true,
    'maBlockquote__cite maBlockquote__cite--noCite': !caption,
    'maBlockquote__cite maBlockquote__cite--link': caption && element.url,
  });

  const handleCiteClick = () => {
    dispatch(openBlockQuoteCiteModal(element));
  };

  return (
    <blockquote className="ma__blockquote" {...attributes}>
      <div className="maBlockquote">
        {children}
        <footer className="maBlockquote__footer" contentEditable={false}>
          <p className="maBlockquote__p maBlockquote__p--footer">
            <cite className={citeClassName} onClick={handleCiteClick}>
              {caption}
            </cite>
          </p>
        </footer>
      </div>
    </blockquote>
  );
};

export type BlockQuoteElement = {
  type: 'blockquote';
  url: string;
  caption: string;
  children: Descendant[];
};

export default BlockQuote;

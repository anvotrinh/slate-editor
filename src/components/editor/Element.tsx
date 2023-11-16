import React from 'react';
import { Descendant } from 'slate';
import { RenderElementProps } from 'slate-react';

import Embed, { EmbedElement } from './embed';
import Image, { ImageElement } from './image';
import Link, { LinkElement } from './link';
import BlockQuote, { BlockQuoteElement } from './blockquote';
import Footnote, { FootnoteElement, Sup, SupElement } from './footnote';
import Code, { CodeElement } from './code';
import HorizontalRule, { HorizontalRuleElement } from './horizontalRule';
import Module, { ModuleElement } from './module';
import List, {
  ListElement,
  ListItem,
  ListItemElement,
  ListItemText,
  ListItemTextElement,
} from './list';
import Paragraph, { ParagraphElement } from './paragraph';

const Element = (props: RenderElementProps): JSX.Element => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'embed-page':
    case 'embed-youtube':
    case 'embed-vimeo':
    case 'embed-brightcove':
    case 'embed-twitter':
    case 'embed-instagram':
    case 'embed-facebook':
    case 'embed-spotify':
      return <Embed {...props} />;
    case 'image':
      return <Image {...props} />;
    case 'link':
      return <Link {...props} />;
    case 'blockquote':
      return <BlockQuote {...props} />;
    case 'footnote':
      return <Footnote {...props} />;
    case 'sup':
      return <Sup {...props} />;
    case 'code-highlight':
      return <Code {...props} />;
    case 'horizontal-rule':
      return <HorizontalRule {...props} />;
    case 'module':
      return <Module {...props} />;
    case 'box':
      return (
        <div className="ma__boxed" {...attributes}>
          {children}
        </div>
      );
    case 'heading-one':
      return (
        <h1 className="ma__h1" {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 className="ma__h2" {...attributes}>
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3 className="ma__h3" {...attributes}>
          {children}
        </h3>
      );
    case 'heading-four':
      return (
        <h4 className="ma__h4" {...attributes}>
          {children}
        </h4>
      );
    case 'heading-five':
      return (
        <h5 className="ma__h5" {...attributes}>
          {children}
        </h5>
      );
    case 'heading-six':
      return (
        <h6 className="ma__h6" {...attributes}>
          {children}
        </h6>
      );
    case 'preformatted':
      return (
        <pre className="ma__pre" {...attributes}>
          {children}
        </pre>
      );
    case 'unordered-list':
      return <List {...props} />;
    case 'list-item':
      return <ListItem {...props} />;
    case 'list-item-text':
      return <ListItemText {...props} />;
    case 'paragraph':
    default:
      return <Paragraph {...props} />;
  }
};

export type BoxElement = {
  type: 'box';
  children: Descendant[];
};

export type HeadingElement = {
  type:
    | 'heading-one'
    | 'heading-two'
    | 'heading-three'
    | 'heading-four'
    | 'heading-five'
    | 'heading-six';
  children: Descendant[];
};

export type PreformattedElement = {
  type: 'preformatted';
  children: Descendant[];
};

export type CustomElement =
  | EmbedElement
  | ImageElement
  | LinkElement
  | BlockQuoteElement
  | FootnoteElement
  | SupElement
  | CodeElement
  | HorizontalRuleElement
  | ModuleElement
  | BoxElement
  | HeadingElement
  | PreformattedElement
  | ListElement
  | ListItemElement
  | ListItemTextElement
  | ParagraphElement;

export type ElementType = CustomElement['type'];

export default Element;

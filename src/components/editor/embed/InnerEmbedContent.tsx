import React from 'react';
import { EmbedElement } from '.';

type Props = {
  element: EmbedElement;
};

const InnerEmbedContent = ({ element }: Props): JSX.Element => {
  switch (element.type) {
    case 'embed-page':
      return (
        <iframe
          src={element.attrsSrc}
          className="ma__iframe ma__iframe--embedded ma__iframe--editor"
        />
      );
    case 'video':
    case 'embed-youtube':
    case 'embed-vimeo':
    case 'embed-brightcove':
      return (
        <iframe
          src={element.attrsSrc}
          className="ma__iframe ma__iframe--editor"
          frameBorder="0"
          allowFullScreen={true}
        />
      );
    case 'embed-twitter':
      return (
        <blockquote className="twitter-tweet" data-lang="en">
          <a href={element.url}></a>
        </blockquote>
      );
    case 'embed-instagram':
      return (
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink={element.url}
          data-instgrm-version="12"
          style={{ width: '500px' }}
        />
      );
    case 'embed-facebook':
      return (
        <div className="fb-post" data-href={element.url} data-width="auto" />
      );
    case 'embed-spotify':
      return (
        <iframe
          src={element.attrsSrc}
          className="ma__iframe"
          frameBorder="0"
          allowTransparency={true}
        />
      );
    default:
      return <div />;
  }
};

export default InnerEmbedContent;

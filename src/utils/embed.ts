import { Editor, Element, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { EmbedElement } from '../components/editor/embed';
import { EMBED_TYPES, removePreviousEmptyBlock } from './block';
import { isSelectionHasElementType } from './selection';

export const isEmbedElement = (element: Element): element is EmbedElement => {
  return EMBED_TYPES.includes(element.type);
};

export const removeEmbed = (editor: Editor, node: EmbedElement): void => {
  const path = ReactEditor.findPath(editor, node);
  Transforms.removeNodes(editor, { at: path });
};

const getStartSeconds = (url: string): string => {
  if (!/#t=/.test(url)) {
    return '';
  }
  const timeStr = (/#t=(\w+)/.exec(url) || [])[1] || '';
  const minutes = parseInt((/(\d+)m/.exec(timeStr) || [])[1], 10) || 0;
  const seconds = parseInt((/(\d+)s/.exec(timeStr) || [])[1], 10) || 0;
  return (minutes * 60 + seconds).toString();
};

export const createEmbedElement = (
  url: string,
  iframeURL: string
): EmbedElement | null => {
  if (!iframeURL) return null;

  const children = [{ text: '' }];

  const youtubeIDRegexp =
    /(?:https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)([\w_-]+)/;
  if (youtubeIDRegexp.test(url)) {
    const youtubeIDRegexpResults = youtubeIDRegexp.exec(url);
    if (!youtubeIDRegexpResults) return null;
    const videoID = youtubeIDRegexpResults[1];
    const startSeconds = getStartSeconds(url);
    const videoParam = startSeconds ? `?start=${startSeconds}` : '';
    const videoURL = `https://www.youtube.com/embed/${videoID}${videoParam}`;
    return {
      type: 'embed-youtube',
      url,
      attrsSrc: videoURL,
      children,
    };
  }

  const vimeoIDRegexp = /(?:https:\/\/vimeo\.com\/)(\d+)/;
  if (vimeoIDRegexp.test(url)) {
    const vimeoIDRegexpResults = vimeoIDRegexp.exec(url);
    if (!vimeoIDRegexpResults) return null;
    const videoID = vimeoIDRegexpResults[1];
    const videoURL = `https://player.vimeo.com/video/${videoID}`;
    return {
      type: 'embed-vimeo',
      url,
      attrsSrc: videoURL,
      children,
    };
  }

  const twitterRegexp = /https:\/\/twitter\.com\/\w+\/status\/\d+/;
  if (twitterRegexp.test(url)) {
    return {
      type: 'embed-twitter',
      url,
      attrsSrc: '',
      children,
    };
  }

  const instagramRegexp = /https:\/\/www\.instagram\.com\/(p|tv)\/[\w_-]+\/?/;
  if (instagramRegexp.test(url)) {
    return {
      type: 'embed-instagram',
      url,
      attrsSrc: '',
      children,
    };
  }

  const facebookRegexp = /https:\/\/www\.facebook\.com\//;
  if (facebookRegexp.test(url)) {
    return {
      type: 'embed-facebook',
      url,
      attrsSrc: '',
      children,
    };
  }

  const spotifyRegexp =
    /https?:\/\/(?:open|play)\.spotify\.com\/(track|album|artist|playlist)\/(\w+)/;
  if (spotifyRegexp.test(url)) {
    const spotifyRegexpResults = spotifyRegexp.exec(url);
    if (!spotifyRegexpResults) return null;
    const spotifyType = spotifyRegexpResults[1];
    const spotifyID = spotifyRegexpResults[2];
    const spotifyURI = `spotify:${spotifyType}:${spotifyID}`;
    return {
      type: 'embed-spotify',
      url: spotifyURI,
      attrsSrc: `https://open.spotify.com/embed?uri=${encodeURIComponent(
        spotifyURI
      )}`,
      children,
    };
  }

  const brightcoveRegexp =
    /https?:\/\/players.brightcove.net\/(\d+)\/([\w_]+)\/index.html\?videoId=(\d+)/;
  if (brightcoveRegexp.test(url)) {
    const brightcoveRegexpResults = brightcoveRegexp.exec(url);
    if (!brightcoveRegexpResults) return null;
    const accountID = brightcoveRegexpResults[1];
    const player = brightcoveRegexpResults[2];
    const videoID = brightcoveRegexpResults[3];
    return {
      type: 'embed-brightcove',
      url,
      attrsSrc: `https://players.brightcove.net/${accountID}/${player}/index.html?videoId=${videoID}`,
      children,
    };
  }

  return {
    type: 'embed-page',
    url,
    attrsSrc: iframeURL,
    children,
  };
};

export const insertEmbed = (
  editor: Editor,
  embedElement: EmbedElement
): void => {
  if (isSelectionHasElementType(editor, 'image')) return;
  Transforms.insertNodes(editor, embedElement);
  removePreviousEmptyBlock(editor);
  Transforms.move(editor);
};

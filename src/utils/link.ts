import { Editor, Element, Transforms } from 'slate';
import isUrl from 'is-url';
import { ReactEditor } from 'slate-react';

import { LinkElement } from '../components/editor/link';
import { isElementHasType } from './element';
import { openLinkModal } from '../store/modal';
import { store } from '../store';
import { isSelectionHasElementType } from './selection';

export const unwrapLink = (editor: Editor): void => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      isElementHasType(n, 'link'),
  });
};

export const insertLink = (editor: Editor, url: string, text: string): void => {
  if (isSelectionHasElementType(editor, 'image')) return;
  if (!ReactEditor.isFocused(editor)) {
    ReactEditor.focus(editor);
  }

  const link: LinkElement = {
    type: 'link',
    url,
    children: [{ text }],
  };
  Transforms.insertNodes(editor, link);
  Transforms.move(editor, { unit: 'offset' });
};

export const setLink = (
  editor: Editor,
  element: LinkElement,
  url: string,
  text: string
): void => {
  if (isSelectionHasElementType(editor, 'image')) return;
  if (!ReactEditor.isFocused(editor)) {
    ReactEditor.focus(editor);
  }

  const path = ReactEditor.findPath(editor, element);
  // create new text with current marks
  const newText = {
    ...element.children[0],
    text,
  };
  Transforms.removeNodes(editor, { at: path });

  const link: LinkElement = {
    type: 'link',
    url,
    children: [newText],
  };
  Transforms.insertNodes(editor, link);
};

export const withLinks = (editor: Editor): Editor => {
  const { insertData } = editor;

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    if (text && isUrl(toFormalURL(text))) {
      store.dispatch(openLinkModal({ url: toFormalURL(text) }));
    } else {
      insertData(data);
    }
  };

  return editor;
};

export const toFormalURL = (url: string): string => {
  const spotifyRegexp = /^spotify:(track|album|artist|playlist):(\\w+)$/;
  if (spotifyRegexp.test(url)) {
    const resultSpotify = spotifyRegexp.exec(url);
    if (!resultSpotify) return '';
    const spotifyType = resultSpotify[1];
    const spotifyID = resultSpotify[2];
    return `https://open.spotify.com/${spotifyType}/${spotifyID}`;
  }

  const instagramRegexp =
    /(?:https?:\/\/)?(?:www\.)?instagr(?:\.am|am\.com)\/(p|tv)\/([\w_-]+)\/?/;
  if (instagramRegexp.test(url)) {
    const resultInstagram = instagramRegexp.exec(url);
    if (!resultInstagram) return '';
    const instagramType = resultInstagram[1];
    const instagramID = resultInstagram[2];
    return `https://www.instagram.com/${instagramType}/${instagramID}`;
  }

  if (!/^https?:\/\//.test(url)) {
    return `https://${url}`;
  }
  return url;
};

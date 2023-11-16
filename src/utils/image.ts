import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { ImageElement } from '../components/editor/image';
import { getCurrentEmptyParagraph } from './paragraph';

export const imageURLFromID = (id: string, type: string): string => {
  const base = 'https://res.cloudinary.com/nordot-dev';
  switch (type) {
    case 'thumb':
      return `${base}/c_limit,w_200,f_auto,q_auto:eco/ch/images/${id}/origin_1.png`;
    default:
      return `${base}/c_limit,w_800,f_auto,q_auto:eco/ch/images/${id}/origin_1.png`;
  }
};

type ImageData = Omit<ImageElement, 'type' | 'children'>;
export const insertImage = (editor: Editor, imageData: ImageData): void => {
  const image: ImageElement = {
    type: 'image',
    children: [{ text: '' }],
    ...imageData,
  };
  Transforms.insertNodes(editor, image);
};

export const insertImages = (
  editor: Editor,
  imageDataList: ImageData[]
): void => {
  if (!ReactEditor.isFocused(editor)) {
    ReactEditor.focus(editor);
  }
  Editor.withoutNormalizing(editor, () => {
    const emptyParagraph = getCurrentEmptyParagraph(editor);
    imageDataList.forEach((imageData) => {
      insertImage(editor, imageData);
    });
    if (emptyParagraph) {
      const emptyParagraphPath = emptyParagraph[1];
      Transforms.removeNodes(editor, { at: emptyParagraphPath });
    }
  });
  Transforms.move(editor);
};

export const removeImage = (editor: Editor, element: ImageElement): void => {
  const path = ReactEditor.findPath(editor, element);
  Transforms.removeNodes(editor, { at: path });
};

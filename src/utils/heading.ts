import { Element } from 'slate';

const headingTypes = [
  'heading-one',
  'heading-two',
  'heading-three',
  'heading-four',
  'heading-five',
  'heading-six',
];

export const isHeadingElement = (element: Element): boolean => {
  return headingTypes.includes(element.type);
};

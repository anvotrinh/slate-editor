import { Descendant, Element, Text } from 'slate';
import { jsx } from 'slate-hyperscript';
import { isHTMLElement, isHTMLText } from './dom';

const ELEMENT_TYPE_MAP: Record<string, string | string[]> = {
  p: 'paragraph',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six',
  ol: 'ordered-list',
  ul: 'unordered-list',
  li: 'list-item',
  blockquote: 'blockquote',
  pre: 'preformatted',
  hr: 'horizontal-rule',
  code: 'code-highlight',
  figure: [
    'image',
    'video',
    'embed-page',
    'embed-youtube',
    'embed-vimeo',
    'embed-brightcove',
    'embed-twitter',
    'embed-instagram',
    'embed-facebook',
    'embed-spotify',
    'module',
  ],
  'div.ma__boxed': 'box',
  'div.footnote': 'footnote',
  sup: 'sup',
};

const LEAF_TYPE_MAP: Record<string, string> = {
  strong: 'bold',
  em: 'italic',
  del: 'strikethrough',
};

type JSXChild = Descendant | string | null;
type JSXChildren = JSXChild | JSXChild[];

// Example case: <strong><a href="..">text</a></strong>, <a> tag inside <strong> tag
// To satisfying Slate, that the leaf can only contains string. "normalizeLeafChildren"
// will apply the "strong" (text format) to all "a" (element) 's text children.
const normalizeLeafChildren = (
  type: string,
  children: JSXChild[]
): JSXChild[] => {
  return children.map((child) => {
    if (!child) return child;
    if (typeof child === 'string') {
      return jsx('text', { [type]: true }, child);
    }
    if (Text.isText(child) && child.text !== '') {
      return jsx('text', { ...child, [type]: true }, child.text);
    }
    if (Element.isElement(child)) {
      return jsx('element', child, normalizeLeafChildren(type, child.children));
    }
    return null;
  });
};

const deserializeElement = (el: HTMLElement): JSXChildren => {
  let children = Array.from(el.childNodes).map(deserializeNode).flat();

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  let tagName = el.nodeName.toLowerCase();
  if (tagName === 'br') return '\n';
  // convert leaf
  const leafType = LEAF_TYPE_MAP[tagName];
  if (leafType) {
    return normalizeLeafChildren(leafType, children);
  }
  // convert element <a>
  if (tagName === 'a')
    return jsx(
      'element',
      { type: 'link', url: el.getAttribute('href') },
      children
    );
  // convert element not <a>
  if (tagName === 'div') {
    tagName += `.${el.className}`;
  }
  const elType = ELEMENT_TYPE_MAP[tagName];
  if (!elType) return children;
  const { type: dataType, ...data } = el.dataset;
  let type;
  if (Array.isArray(elType)) {
    if (!dataType || !elType.includes(dataType)) return null;
    type = dataType;
  } else {
    type = elType;
  }
  // remove sup and code highlight children
  const elChildren =
    elType === 'sup' || elType === 'code-highlight' ? [''] : children;
  if (elType === 'code-highlight') {
    data.value = data.value?.replace(/<br>/g, '\n') || '';
  }
  return jsx('element', { type, ...data }, elChildren);
};

const deserializeNode = (n: Node): JSXChildren => {
  if (isHTMLText(n)) {
    return n.textContent;
  } else if (isHTMLElement(n)) {
    return deserializeElement(n);
  }
  return null;
};

const deserializeBody = (body: HTMLElement): Descendant[] => {
  const children = Array.from(body.childNodes).map(deserializeNode);
  return jsx('fragment', {}, children);
};

const deserialize = (html: string): Descendant[] => {
  const document = new DOMParser().parseFromString(
    html.replace(/\n/g, ''),
    'text/html'
  );
  return deserializeBody(document.body);
};

export default deserialize;

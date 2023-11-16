import { Editor, Node, Text } from 'slate';
import { isInsideOf } from './block';
import { encodeURL } from './common';
import { getDepthOfListItem } from './list';

const serializeText = (editor: Editor, textNode: Text): string => {
  if (isInsideOf(editor, textNode, ['preformatted'])) {
    return textNode.text;
  }
  return textNode.text
    .replace(/[\\{}[\]()#*+_`~<>-]/g, '\\$&')
    .replace(/\n/g, '  \n')
    .replace(/&/g, '\\&');
};

const serializeNode = (editor: Editor, node: Node): string => {
  if (Text.isText(node)) {
    let string = serializeText(editor, node);
    if (node.bold) {
      string = `**${string}**`;
    }
    if (node.italic) {
      string = `_${string}_`;
    }
    if (node.strikethrough) {
      string = `~~${string}~~`;
    }
    return string;
  }

  const children = node.children
    .map((n) => {
      const content = serializeNode(editor, n);
      return Editor.isBlock(editor, n) ? `${content}\n` : content;
    })
    .join('')
    .replace(/\n+$/g, '');
  if (Editor.isEditor(node)) return children;

  switch (node.type) {
    case 'paragraph':
      return `${children}\n`;
    case 'heading-one':
      return `# ${children}\n`;
    case 'heading-two':
      return `## ${children}\n`;
    case 'heading-three':
      return `### ${children}\n`;
    case 'heading-four':
      return `#### ${children}\n`;
    case 'heading-five':
      return `##### ${children}\n`;
    case 'heading-six':
      return `###### ${children}\n`;
    case 'blockquote': {
      const content = children.split('\n').join('\n> ');
      const { caption, url } = node;
      let cite = '';
      if (caption) {
        if (url) {
          cite = `> cite: [${caption}](${url})\n`;
        } else {
          cite = `> cite: ${caption}\n`;
        }
      }
      return `> ${content}\n${cite}`;
    }
    case 'unordered-list':
      return `${children}\n`;
    case 'list-item': {
      const depth = getDepthOfListItem(editor, node);
      const indent = ' '.repeat((depth - 1) * 2);
      return `${indent}- ${children}`;
    }
    case 'list-item-text': {
      return `${children}`;
    }
    case 'horizontal-rule':
      return '***\n';
    case 'preformatted': {
      return `\`\`\`\n${children}\n\`\`\`\n`;
    }
    case 'image': {
      return `[[image]](${node.id})\n`;
    }
    case 'code-highlight': {
      const { language, value } = node;
      return `\`\`\`${language}\n${value}\n\`\`\`\n`;
    }
    case 'video':
    case 'embed-page':
    case 'embed-youtube':
    case 'embed-vimeo':
    case 'embed-twitter':
    case 'embed-instagram':
    case 'embed-facebook':
    case 'embed-spotify':
    case 'embed-brightcove': {
      const { type, url } = node;
      return `[[${type}]](${url})\n`;
    }
    case 'box': {
      return `~~~\n${children}\n~~~\n`;
    }
    case 'module': {
      return `[[module id="${node.moduleId}" context-id="${node.moduleContextId}"]]\n`;
    }
    case 'link': {
      const { url } = node;
      return `[${children}](${encodeURL(url)})`;
    }
    case 'sup': {
      const { index } = node;
      return `[^${index}]`;
    }
    case 'footnote': {
      const { index } = node;
      const childrenIndent = children
        .split('\n')
        .map((line, i) => {
          if (line === '') return line;
          return (i !== 0 ? ' ' : '') + line.trim();
        })
        .join('\n');
      return childrenIndent === '' ? '' : `[^${index}]: ${childrenIndent}\n`;
    }
    default:
      return '';
  }
};

const serialize = (editor: Editor): string => {
  const [rootNode] = Editor.node(editor, []);
  return serializeNode(editor, rootNode);
};

export default serialize;

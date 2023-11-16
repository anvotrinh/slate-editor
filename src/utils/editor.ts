import { Editor, Transforms, Element, Node } from 'slate';

import deserialize from './deserialize';
import { getEmptyParagraph, isElementEmptyParagraph } from './paragraph';
import { getSelectionLowestBlock } from './selection';

export const withEditors = (editor: Editor): Editor => {
  const {
    normalizeNode,
    insertData,
    insertTextData,
    insertText,
    insertFragment,
  } = editor;

  editor.normalizeNode = (entry) => {
    const path = entry[1];
    // is editor
    if (path.length === 0) {
      // if last node is not paragraph, insert a paragraph at end
      let shouldInsertParagraph = false;
      if (editor.children.length < 1) {
        shouldInsertParagraph = true;
      } else {
        const lastChild = editor.children[editor.children.length - 1];
        shouldInsertParagraph =
          !Element.isElement(lastChild) || lastChild.type !== 'paragraph';
      }
      if (shouldInsertParagraph) {
        Transforms.insertNodes(editor, getEmptyParagraph(), {
          at: [editor.children.length],
        });
        return;
      }
    }

    normalizeNode(entry);
  };

  // when moving a fragment, slate also take the wrapper block with it
  // so we have to unwrap the wrapper block
  editor.insertFragment = (fragment) => {
    let insertedFragment: Node[] = fragment;
    while (
      insertedFragment.length === 1 &&
      Editor.isBlock(editor, insertedFragment[0]) &&
      ['blockquote', 'box'].includes(insertedFragment[0].type)
    ) {
      insertedFragment = insertedFragment[0].children;
    }

    return insertFragment(insertedFragment);
  };

  // convert pasted value to text on preformatted block
  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    const nodeEntry = getSelectionLowestBlock(editor);
    if (!nodeEntry) return insertData(data);
    const [block] = nodeEntry;
    if (block.type === 'preformatted') {
      insertText(text);
      return;
    }

    return insertData(data);
  };

  // use insertTextData to only catch paste html from outside
  editor.insertTextData = (data) => {
    const html = data.getData('text/html');
    if (html) {
      const fragment = deserialize(html);
      Transforms.insertFragment(editor, fragment);
      return true;
    }

    // original insertTextData: new line -> split into 2 paragraph blocks
    // to make the text display correctly, we convert new line -> new line
    // and empty line -> split into 2 paragraph blocks
    const text = data.getData('text/plain');
    if (text) {
      const lines = text.split(/\r\n|\r|\n/);
      let split = false;
      for (const line of lines) {
        if (line === '') {
          Transforms.splitNodes(editor, {
            always: true,
          });
          split = false;
          continue;
        }
        if (split) {
          insertText('\n');
        }
        insertText(line);
        split = true;
      }
      return true;
    }

    return insertTextData(data);
  };

  return editor;
};

export const getEditorLastAndEmptyParagraph = (
  editor: Editor
): Element | null => {
  if (editor.children.length === 1) return null;
  const lastChild = editor.children[editor.children.length - 1];
  // element is paragraph element
  if (!Element.isElement(lastChild)) return null;
  return isElementEmptyParagraph(lastChild) ? lastChild : null;
};

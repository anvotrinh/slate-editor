import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { ReactEditor, Slate, withReact } from 'slate-react';
import {
  BaseEditor,
  createEditor,
  Descendant,
  Editor,
  Node,
  Selection,
} from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';

import EditorToolbar from './toolbar';
import { withEditors } from '../../utils/editor';
import { withBlocks } from '../../utils/block';
import { withList } from '../../utils/list';
import { withLinks } from '../../utils/link';
import { CustomText } from './Leaf';
import { CustomElement } from './Element';
import BlockQuoteCiteModal from './blockquote/BlockQuoteCiteModal';
import ImageModal from './image/ImageModal';
import { useAppSelector } from '../../hooks/redux';
import MarkdownTextarea from '../markdownTextarea';
import RichTextEditor from './RichTextEditor';
import LinkModal from './link/LinkModal';
import CodeLanguageModal from './code/CodeLanguageModal';
import PreviewModal from './preview/PreviewModal';
import { ImageBlob } from '../coverImage/utils';
import serialize from '../../utils/serialize';

type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    blurSelection: Selection;
  };

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

declare global {
  interface Window {
    twttr: {
      widgets: {
        load: (dom: HTMLElement) => void;
      };
    };
    instgrm: {
      Embeds: {
        process: () => void;
      };
    };
    FB: {
      XFBML: {
        parse: (dom: HTMLElement) => void;
      };
    };
  }
}

type Props = {
  initialValue: Descendant[];
  coverImageBlob: ImageBlob | null;
};

export type SlateEditorRef = {
  getContentMarkdown: () => string;
};
const SlateEditor = (
  { initialValue, coverImageBlob }: Props,
  ref: Ref<SlateEditorRef>
): JSX.Element => {
  const { editorMode, markdownText } = useAppSelector((state) => state.editor);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  useImperativeHandle(
    ref,
    (): SlateEditorRef => ({
      getContentMarkdown: (): string => {
        return editorMode === 'richText' ? serialize(editor) : markdownText;
      },
    })
  );
  // can not use for loop here to make it flatten
  // it will create some bug in override function
  const editor = useMemo(
    () =>
      withEditors(
        withBlocks(withList(withLinks(withHistory(withReact(createEditor())))))
      ),
    []
  );

  useEffect(() => {
    editor.normalizeNode([editor, []]);
    for (const nodeEntry of Node.descendants(editor)) {
      const [node] = nodeEntry;
      // incase adjacent texts with same format, normalizeNode for editor
      // then normalizeNode for paragraph cause error. So we skip the normalizeNode
      // for paragraph since paragraph unaffected by normalizeNode.
      if (Editor.isBlock(editor, node) && node.type === 'paragraph') continue;
      editor.normalizeNode(nodeEntry);
    }
  }, [editor]);

  return (
    <div className="editor__editArea">
      <Slate editor={editor} value={value} onChange={setValue}>
        <EditorToolbar />
        <RichTextEditor isVisible={editorMode === 'richText'} />
        <MarkdownTextarea isVisible={editorMode === 'markdown'} />
        <BlockQuoteCiteModal />
        <ImageModal />
        <LinkModal />
        <CodeLanguageModal />
        <PreviewModal coverImageBlob={coverImageBlob} />
      </Slate>
    </div>
  );
};

export default forwardRef(SlateEditor);

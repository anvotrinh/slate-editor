import React, { useEffect, useRef } from 'react';
import cx from 'classnames';

import {
  FaBold,
  FaItalic,
  FaListUl,
  FaQuoteLeft,
  FaRegSquare,
  FaStrikethrough,
} from 'react-icons/fa';

import ImageButton from '../image/ImageButton';
import LinkButton from '../link/LinkButton';
import BlockButton from './BlockButton';
import MarkButton from './MarkButton';
import ModeSwitcher from './ModeSwitcher';
import ParagraphDropdown from './ParagraphDropdown';
import FootnoteButton from '../footnote/FootnoteButton';
import CodeButton from '../code/CodeButton';
import PreviewButton from '../preview/PreviewButton';
import HRButton from '../horizontalRule/HRButton';
import { useAppSelector } from '../../../hooks/redux';

const EditorToolbar = (): JSX.Element => {
  const { editorMode } = useAppSelector((state) => state.editor);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const doms = document.getElementsByClassName('main__contents--editor');
    if (doms.length !== 1) return;

    const mainEditorDOM = doms[0];
    const handleScroll = () => {
      const isSticky = mainEditorDOM.scrollTop > 354;
      containerRef.current?.classList.toggle('editor__tool--sticky', isSticky);
    };
    mainEditorDOM.addEventListener('scroll', handleScroll);
    return () => {
      mainEditorDOM.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toolListClass = cx({
    editorToolList: true,
    'editorToolList--disabled': editorMode === 'markdown',
  });
  return (
    <div className="editor__tool" ref={containerRef}>
      <div className="editor__list">
        <ul className={toolListClass}>
          <ParagraphDropdown />
          <MarkButton format="bold" label="Bold">
            <FaBold />
          </MarkButton>
          <MarkButton format="italic" label="Italic">
            <FaItalic />
          </MarkButton>
          <MarkButton format="strikethrough" label="Strikethrough">
            <FaStrikethrough />
          </MarkButton>
          <BlockButton format="unordered-list" label="List">
            <FaListUl />
          </BlockButton>
          <BlockButton format="blockquote" label="Blockquote">
            <FaQuoteLeft />
          </BlockButton>
          <BlockButton format="box" label="Box">
            <FaRegSquare />
          </BlockButton>
          <LinkButton />
          <HRButton />
          <ImageButton />
          <CodeButton />
          <FootnoteButton />
        </ul>
      </div>
      <div className="editor__list">
        <ul className="editorToolList">
          <ModeSwitcher />
          <PreviewButton />
        </ul>
      </div>
    </div>
  );
};

export default EditorToolbar;

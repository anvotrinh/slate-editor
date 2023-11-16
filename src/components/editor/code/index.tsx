import React from 'react';
import { RenderElementProps, useSlateStatic } from 'slate-react';
import { FaAngleDown } from 'react-icons/fa';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-perl';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-diff';
import 'ace-builds/src-noconflict/theme-solarized_dark';

import { useAppDispatch } from '../../../hooks/redux';
import { codeLanguageOptionMap } from './CodeLanguageModal';
import { openCodeLanguageModal } from '../../../store/modal';
import { CustomText } from '../Leaf';
import { isElementHasType } from '../../../utils/element';
import { setCode } from '../../../utils/code';

const Code = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element | null => {
  const editor = useSlateStatic();
  const dispatch = useAppDispatch();
  if (!isElementHasType<CodeElement>(element, 'code-highlight')) return null;

  const { value, language } = element;

  const handleCodeLanguageClick = () => {
    dispatch(openCodeLanguageModal(element));
  };

  const handleCodeEditorChange = (value: string) => {
    setCode(editor, element, { value });
  };

  // check supported language
  let codeLanguage = language;
  if (
    !Object.prototype.hasOwnProperty.call(codeLanguageOptionMap, codeLanguage)
  ) {
    codeLanguage = 'text';
    setCode(editor, element, { language: codeLanguage });
  }
  const languageLabel = codeLanguageOptionMap[codeLanguage].label;
  // Have to create a wrapper div and take children outside to avoid bug when Code block
  // is the first editor's child, Ctrl+A -> Delete can't remove all content.
  return (
    <div {...attributes}>
      {children}
      <div className="editor__code" contentEditable={false}>
        <button
          className="editor__buttonChangeLanguage"
          onClick={handleCodeLanguageClick}
        >
          <span className="editor__languageSwichButton__label">
            {languageLabel}
          </span>
          <FaAngleDown />
        </button>
        <AceEditor
          width="100%"
          name="codehighlight"
          mode={codeLanguageOptionMap[codeLanguage].ace}
          onChange={handleCodeEditorChange}
          theme="solarized_dark"
          showPrintMargin={true}
          showGutter={false}
          highlightActiveLine={true}
          editorProps={{ $blockScrolling: true }}
          focus={false}
          onLoad={(aceEditor) => {
            aceEditor.renderer.setPadding(20);
            aceEditor.renderer.setScrollMargin(20, 20, 0, 0);
            // use setTimeout to avoid slate unable to find cursor point
            setTimeout(() => aceEditor.focus());
          }}
          value={value}
          setOptions={{
            useWorker: false,
            showLineNumbers: false,
            tabSize: 2,
            minLines: 5,
            maxLines: 5000,
          }}
        />
      </div>
    </div>
  );
};

export type CodeElement = {
  type: 'code-highlight';
  value: string;
  language: string;
  children: CustomText[];
};

export default Code;

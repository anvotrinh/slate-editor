import React from 'react';
import { useSlateStatic } from 'slate-react';

import Modal from '../../modal';
import i18n from '../../../utils/i18n';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setCode } from '../../../utils/code';
import { closeCodeLanguageModal } from '../../../store/modal';
import CodeLanguageModalButton from './CodeLanguageModalButton';

export type CodeLanguageOption = {
  id: string;
  label: string;
  ace: string;
};

export const codeLanguageOptionMap: Record<string, CodeLanguageOption> = {
  java: {
    id: 'java',
    label: 'Java',
    ace: 'java',
  },
  golang: {
    id: 'golang',
    label: 'Golang',
    ace: 'golang',
  },
  html: {
    id: 'html',
    label: 'HTML',
    ace: 'html',
  },
  css: {
    id: 'css',
    label: 'CSS',
    ace: 'css',
  },
  xml: {
    id: 'xml',
    label: 'XML',
    ace: 'xml',
  },
  javascript: {
    id: 'javascript',
    label: 'Javascript',
    ace: 'javascript',
  },
  php: {
    id: 'php',
    label: 'PHP',
    ace: 'php',
  },
  perl: {
    id: 'perl',
    label: 'Perl',
    ace: 'perl',
  },

  python: {
    id: 'python',
    label: 'Python',
    ace: 'python',
  },
  ruby: {
    id: 'ruby',
    label: 'Ruby',
    ace: 'ruby',
  },
  sql: {
    id: 'sql',
    label: 'SQL',
    ace: 'sql',
  },

  text: {
    id: 'text',
    label: 'Text',
    ace: 'text',
  },
  c: {
    id: 'c',
    label: 'C',
    ace: 'c_cpp',
  },
  cpp: {
    id: 'cpp',
    label: 'C++',
    ace: 'c_cpp',
  },
  sh: {
    id: 'sh',
    label: 'sh',
    ace: 'sh',
  },
  bash: {
    id: 'bash',
    label: 'Bash',
    ace: 'sh',
  },
  zsh: {
    id: 'zsh',
    label: 'zsh',
    ace: 'sh',
  },
  diff: {
    id: 'diff',
    label: 'Diff',
    ace: 'diff',
  },
};

const CodeLanguageModal = (): JSX.Element => {
  const editor = useSlateStatic();
  const dispatch = useAppDispatch();

  const { isCodeLanguageModalOpen, codeElement, codeModalLanguage } =
    useAppSelector((state) => state.modal);

  const close = () => {
    dispatch(closeCodeLanguageModal());
  };

  const handleSubmit = () => {
    close();
    codeElement &&
      setCode(editor, codeElement, { language: codeModalLanguage });
  };
  return (
    <Modal isOpen={isCodeLanguageModalOpen} onClose={close}>
      <section className="modal__wrapper">
        <header className="modal__header">
          <h5 className="modal__title">
            {i18n.get('code_editor_modal_title')}
          </h5>
        </header>
        <div className="modal__body">
          <div>
            {Object.keys(codeLanguageOptionMap).map((key) => (
              <CodeLanguageModalButton
                key={key}
                {...codeLanguageOptionMap[key]}
              />
            ))}
          </div>
        </div>
        <footer className="modal__footer">
          <div className="modal__buttonWrapper">
            <button
              className="modal__button modal__button--addingLabel modal__button--positive"
              type="button"
              onClick={handleSubmit}
            >
              {i18n.get('update')}
            </button>
            <button
              className="modal__button modal__button--addingLabel"
              type="button"
              onClick={close}
            >
              {i18n.get('cancel')}
            </button>
          </div>
        </footer>
      </section>
    </Modal>
  );
};

export default CodeLanguageModal;

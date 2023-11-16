import React, { FormEventHandler, useEffect, useRef } from 'react';
import { useSlateStatic } from 'slate-react';
import { Editor } from 'slate';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import Modal from '../../modal';
import { insertLink, setLink, toFormalURL } from '../../../utils/link';
import {
  closeLinkModal,
  setLinkElementAndInfo,
  setLinkModalText,
  setLinkModalUrl,
  setShouldLinkModalPreserveText,
} from '../../../store/modal';
import i18n from '../../../utils/i18n';
import { infoEmbeddedPage } from '../../../store/embed';
import LinkModalOptions from './LinkModalOptions';
import { AbortThunk } from '../../../store';
import { insertEmbed } from '../../../utils/embed';
import {
  getFirstElementTypeInSelection,
  isSelectionCollapsed,
  isSelectionExpanded,
} from '../../../utils/selection';
import { LinkElement } from '.';

const LinkModal = (): JSX.Element => {
  const editor = useSlateStatic();
  const dispatch = useAppDispatch();
  const {
    isLinkModalOpen,
    linkElement,
    linkModalUrl,
    linkModalFormat,
    linkModalText,
    linkModalFetchedEmbed,
  } = useAppSelector((state) => state.modal);
  const infoEmbedRequest = useRef<AbortThunk | null>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const isEditingMode = !!linkElement;

  const close = () => {
    if (infoEmbedRequest.current) {
      infoEmbedRequest.current.abort();
    }
    dispatch(closeLinkModal());
  };

  useEffect(
    () => {
      if (!isLinkModalOpen) return;
      // if selection expanded => preserve the text / not apply fetched text
      dispatch(setShouldLinkModalPreserveText(isSelectionExpanded(editor)));
      let selectedLink = linkElement;
      if (!linkElement) {
        // incase open modal from toolbar button, use the link in the selection
        const nodeEntry = getFirstElementTypeInSelection<LinkElement>(
          editor,
          'link'
        );
        if (nodeEntry) {
          selectedLink = nodeEntry[0];
        }
      }
      if (selectedLink) {
        dispatch(setLinkElementAndInfo(selectedLink));
      } else if (editor.selection) {
        dispatch(setLinkModalText(Editor.string(editor, editor.selection)));
      }
      setTimeout(() => {
        if (linkModalUrl && isSelectionCollapsed(editor)) {
          handleUrlChange(linkModalUrl);
        }
        // focus and select url input
        if (!urlInputRef.current) return;
        urlInputRef.current.focus();
        urlInputRef.current.select();
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLinkModalOpen]
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const url = toFormalURL(linkModalUrl);
    if (linkElement) {
      setLink(editor, linkElement, url, linkModalText || url);
      close();
      return;
    }
    switch (linkModalFormat) {
      case 'text':
        insertLink(editor, url, linkModalText || url);
        break;
      case 'embed':
        if (linkModalFetchedEmbed) {
          insertEmbed(editor, linkModalFetchedEmbed);
        }
        break;
      case 'url':
        insertLink(editor, url, url);
        break;
      default:
    }
    close();
  };

  const handleUrlChange = (url: string): void => {
    dispatch(setLinkModalUrl(url));
    // don't fetch data if edit mode
    if (isEditingMode) return;
    // abort running request
    if (infoEmbedRequest.current) {
      infoEmbedRequest.current.abort();
    }
    infoEmbedRequest.current = dispatch(infoEmbeddedPage(toFormalURL(url)));
  };

  return (
    <Modal isOpen={isLinkModalOpen} onClose={close}>
      <form onSubmit={handleSubmit} style={{ height: '100%' }}>
        <section className="modal__wrapper">
          <header className="modal__header">
            <h1 className="modal__title">{i18n.get('link')}</h1>
          </header>
          <div className="modal__body">
            <div className="modal-editorTextForm">
              <h2 className="modal-editorTextForm__title">URL</h2>
              <input
                ref={urlInputRef}
                className="modal-editorTextForm__inputText"
                placeholder="https://"
                type="text"
                value={linkModalUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              <LinkModalOptions />
            </div>
          </div>
          <footer className="modal__footer">
            <div className="modal__buttonWrapper" />
            <div className="modal__buttonWrapper">
              <button className="modal__button" type="button" onClick={close}>
                {i18n.get('cancel')}
              </button>
              <button
                className="modal__button modal__button--positive"
                type="submit"
              >
                {i18n.get('ok')}
              </button>
            </div>
          </footer>
        </section>
      </form>
    </Modal>
  );
};

export default LinkModal;

import React, { useEffect, useState } from 'react';
import { useSlateStatic } from 'slate-react';
import Modal from '../../modal';
import i18n from '../../../utils/i18n';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setBlockQuote } from '../../../utils/blockquote';
import { closeBlockQuoteCiteModal } from '../../../store/modal';

const BlockQuoteCiteModal = (): JSX.Element => {
  const editor = useSlateStatic();
  const dispatch = useAppDispatch();
  const [captionInput, setCaptionInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const { isBlockQuoteCiteModalOpen, blockQuoteElement } = useAppSelector(
    (state) => state.modal
  );

  useEffect(() => {
    setCaptionInput(blockQuoteElement?.caption || '');
    setUrlInput(blockQuoteElement?.url || '');
  }, [blockQuoteElement]);

  const close = () => {
    dispatch(closeBlockQuoteCiteModal());
  };

  const handleOKClick = () => {
    if (!blockQuoteElement) return;
    setBlockQuote(editor, blockQuoteElement, captionInput, urlInput);
    close();
  };

  return (
    <Modal isOpen={isBlockQuoteCiteModalOpen} onClose={close}>
      <section className="modal__wrapper">
        <header className="modal__header">
          <h5 className="modal__title">{i18n.get('add_a_reference')}</h5>
        </header>
        <div className="modal__body">
          <dl className="modal-editFormList">
            <dt className="modal-editFormList__title">
              {i18n.get('reference_modal_description')}
            </dt>
            <dd className="modal-editFormList__data">
              <input
                className="modal-editFormList__inputText"
                value={captionInput}
                onChange={(e) => setCaptionInput(e.target.value)}
                type="text"
              />
            </dd>
            <dt className="modal-editFormList__title">
              {i18n.get('reference_url')}
            </dt>
            <dd className="modal-editFormList__data">
              <input
                className="modal-editFormList__inputText"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                type="text"
                placeholder="optional"
              />
            </dd>
          </dl>
        </div>
        <footer className="modal__footer">
          <div className="modal__buttonWrapper"></div>
          <div className="modal__buttonWrapper">
            <button className="modal__button" onClick={close} type="button">
              {i18n.get('cancel')}
            </button>
            <button
              className="modal__button modal__button--positive"
              onClick={handleOKClick}
              type="button"
            >
              {i18n.get('ok')}
            </button>
          </div>
        </footer>
      </section>
    </Modal>
  );
};

export default BlockQuoteCiteModal;

import React, { useEffect } from 'react';

import i18n from '../../../utils/i18n';
import Modal from '../../modal';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  applyViewMoreSelectedItem,
  closeViewMoreModal,
  listObject,
} from '../../../store/sidebar';
import { UnionObjectType } from '../../../apis';
import AuthorContentList from './AuthorContentList';
import OtherContentList from './OtherContentList';
import ModalSearchInput from './ModalSearchInput';

type Props = {
  type: UnionObjectType;
};
const SidebarSectionViewMoreModal = ({ type }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const sidebarState = useAppSelector((state) => state.sidebar);
  const { isViewMoreModalOpen } = sidebarState[type];

  useEffect(() => {
    if (!isViewMoreModalOpen) return;
    if (type === 'series' || type === 'topics') {
      dispatch(listObject(type));
    }
  }, [dispatch, type, isViewMoreModalOpen]);

  const close = () => {
    dispatch(closeViewMoreModal(type));
  };

  return (
    <Modal isOpen={isViewMoreModalOpen} onClose={close}>
      <section className="modal__wrapper">
        <header className="modal__header">
          <h5 className="modal__title">{i18n.get(`${type}_list`)}</h5>
        </header>
        <div className="modal__body">
          <div className="modal-articleOptionMore">
            <div className="modal-articleOptionMore__headerWrapper">
              <ModalSearchInput type={type} />
            </div>
            <div className="modal-articleOptionMore__list">
              {type === 'authors' ? (
                <AuthorContentList type={type} />
              ) : (
                <OtherContentList type={type} />
              )}
            </div>
          </div>
        </div>
        <footer className="modal__footer">
          <div className="modal__buttonWrapper"></div>
          <div className="modal__buttonWrapper">
            <button className="modal__button" type="button" onClick={close}>
              {i18n.get('cancel')}
            </button>
            {type === 'authors' && (
              <button
                className="modal__button modal__button--positive"
                type="submit"
                onClick={() => dispatch(applyViewMoreSelectedItem(type))}
              >
                {i18n.get('ok')}
              </button>
            )}
          </div>
        </footer>
      </section>
    </Modal>
  );
};

export default SidebarSectionViewMoreModal;

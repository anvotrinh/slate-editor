import React from 'react';

import i18n from '../../utils/i18n';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import Modal from '../modal';
import { closeGoPrivateModal } from '../../store/modal';
import { setNotifyCurator } from '../../store/post';
import { PostStatus } from '../../apis';

type Props = {
  savePost: (status: PostStatus) => void;
};

const GoPrivateModal = ({ savePost }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { isGoPrivateModalOpen } = useAppSelector((state) => state.modal);
  const { isNotifyCurator } = useAppSelector((state) => state.post);

  const close = () => {
    dispatch(closeGoPrivateModal());
  };

  const handleGoPrivateClick = () => {
    savePost('private');
    close();
  };

  return (
    <Modal isOpen={isGoPrivateModalOpen} onClose={close}>
      <section className="modal__wrapper">
        <header className="modal__header">
          <h5 className="modal__title">{i18n.get('change_status')}</h5>
        </header>
        <div className="modal__body">
          <p className="modal__text">
            {i18n.get('go_private_confirmation_message')}
          </p>
        </div>
        <footer className="modal__footer">
          <div className="modal__buttonWrapper">
            <div className="checkbox checkbox--alignLeft">
              <input
                className="checkbox__inputCheck"
                id="goPrivateNotifyCurators"
                type="checkbox"
                checked={isNotifyCurator}
                onChange={(event) =>
                  dispatch(setNotifyCurator(event.target.checked))
                }
              />
              <label
                className="checkbox__label"
                htmlFor="goPrivateNotifyCurators"
              >
                <span className="checkbox__labelText">
                  {i18n.get('notify_curators')}
                </span>
              </label>
            </div>
          </div>
          <div className="modal__buttonWrapper">
            <button className="modal__button" onClick={close}>
              {i18n.get('cancel')}
            </button>
            <button
              className="modal__button modal__button--positive"
              onClick={handleGoPrivateClick}
            >
              {i18n.get('go_private')}
            </button>
          </div>
        </footer>
      </section>
    </Modal>
  );
};

export default GoPrivateModal;

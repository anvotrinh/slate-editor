import React from 'react';
import { PostStatus } from '../../apis';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { closePublishModal } from '../../store/modal';
import { setNotifyCurator } from '../../store/post';
import { getPostDisplayState } from '../../utils/common';
import { initialPost } from '../../utils/const';
import i18n from '../../utils/i18n';
import Modal from '../modal';
import PublishSettingExpireDate from './PublishSettingExpireDate';
import PublishSettingTag from './publishTag';
import { getSubmitType } from './utils';
import PublishSettingPublishDisplay from './PublishSettingPublishDisplay';

type Props = {
  savePost: (status: PostStatus) => void;
  getPostBodyMarkdown: () => string;
};
const PublishSettingModal = ({
  savePost,
  getPostBodyMarkdown,
}: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { isPublishModalOpen } = useAppSelector((state) => state.modal);
  const { expireOption, publishOption, post, isNotifyCurator } = useAppSelector(
    (state) => state.post
  );

  const close = () => {
    dispatch(closePublishModal());
  };

  const postDisplayState = getPostDisplayState(initialPost);
  const submitType = getSubmitType(
    publishOption,
    post.published_at,
    expireOption,
    post.expired_at
  );
  return (
    <Modal isOpen={isPublishModalOpen} onClose={close}>
      <section className="modal__wrapper">
        <header className="modal__header">
          <h5 className="modal__title">{i18n.get('publishing_settings')}</h5>
        </header>
        <div className="modal__body">
          <dl className="modal-editFormList">
            <dt className="modal-editFormList__title">
              {i18n.get('tags')}
              <span className="modal-editFormList__title--sub">
                {i18n.get('up_to_5_tags')}
              </span>
            </dt>
            <dd className="modal-editFormList__data modal-editFormList__data--label">
              <PublishSettingTag getPostBodyMarkdown={getPostBodyMarkdown} />
            </dd>
            <dt className="modal-editFormList__title">
              {i18n.get('setting_publish_date')}
              <span className="modal-editFormList__title--sub">
                {i18n.get('from_date')}
              </span>
            </dt>
            <dd className="modal-editFormList__data">
              <div className="modal-editFormList__setExpiryDate modal-editFormList__setExpiryDate--start">
                <PublishSettingPublishDisplay />
              </div>
            </dd>
            <dt className="modal-editFormList__title">
              {i18n.get('setting_expire_date')}
              <span className="modal-editFormList__title--sub">
                {i18n.get('to_date')}
              </span>
            </dt>
            <dd className="modal-editFormList__data">
              <div className="modal-editFormList__setExpiryDate">
                <PublishSettingExpireDate />
              </div>
            </dd>
          </dl>
        </div>
        <footer className="modal__footer">
          <div className="modal__buttonWrapper">
            {postDisplayState === 'published' && (
              <div className="checkbox checkbox--alignLeft">
                <input
                  className="checkbox__inputCheck"
                  id="notifyCurators"
                  type="checkbox"
                  checked={isNotifyCurator}
                  onChange={(event) =>
                    dispatch(setNotifyCurator(event.target.checked))
                  }
                />
                <label className="checkbox__label" htmlFor="notifyCurators">
                  <span className="checkbox__labelText">
                    {i18n.get('notify_curators')}
                  </span>
                </label>
              </div>
            )}
          </div>
          <div className="modal__buttonWrapper">
            <button className="modal__button" type="button" onClick={close}>
              {i18n.get('cancel')}
            </button>
            <button
              className="modal__button modal__button--positive"
              type="button"
              onClick={() => savePost('public')}
            >
              {i18n.get(submitType)}
            </button>
          </div>
        </footer>
      </section>
    </Modal>
  );
};

export default PublishSettingModal;

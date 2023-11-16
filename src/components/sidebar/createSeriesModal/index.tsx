import React, { useRef } from 'react';

import Modal from '../../modal';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import i18n from '../../../utils/i18n';
import {
  closeCreateSeriesModal,
  createSeries,
  setCreateSeriesTitle,
  setCreateSeriesDescription,
} from '../../../store/series';
import { showAlertMessage } from '../../../utils/common';
import SeriesImage, { SeriesImageRef } from './SeriesImage';

const CreateSeriesModal = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {
    isCreateSeriesModalOpen,
    createSeriesTitle,
    createSeriesDescription,
  } = useAppSelector((state) => state.series);
  const seriesImageRef = useRef<SeriesImageRef>(null);

  const close = () => {
    dispatch(closeCreateSeriesModal());
  };

  const handleCreateClick = async () => {
    const coverImageFile = seriesImageRef.current?.getCoverImageFile() || null;
    const resultAction = await dispatch(createSeries(coverImageFile));
    if (createSeries.rejected.match(resultAction)) {
      showAlertMessage('Server Error');
      return;
    }
    close();
  };

  return (
    <Modal isOpen={isCreateSeriesModalOpen} onClose={close}>
      <section className="modal__wrapper">
        <header className="modal__header">
          <h5 className="modal__title">{i18n.get('create_series')}</h5>
        </header>
        <div className="modal__body">
          <dl className="modal-editFormList">
            <dt className="modal-editFormList__title">{i18n.get('title')}</dt>
            <dd className="modal-editFormList__data">
              <input
                className="modal-editFormList__inputText"
                type="text"
                value={createSeriesTitle}
                required
                onChange={(e) => {
                  dispatch(setCreateSeriesTitle(e.target.value));
                }}
              />
            </dd>

            <dt className="modal-editFormList__title">
              {i18n.get('cover_image')}
            </dt>
            <dd className="modal-editFormList__data">
              <p className="modal-editFormList__imageUploadNotice">
                {i18n.get('series_cover_image_required_msg')}
              </p>
              <SeriesImage ref={seriesImageRef} />
            </dd>

            <dt className="modal-editFormList__title">
              {i18n.get('description')}
            </dt>
            <dd className="modal-editFormList__data">
              <textarea
                className="modal-editFormList__textarea"
                placeholder=""
                name="description"
                value={createSeriesDescription}
                onChange={(e) =>
                  dispatch(setCreateSeriesDescription(e.target.value))
                }
              />
            </dd>
          </dl>
        </div>
        <footer className="modal__footer">
          <div className="modal__buttonWrapper" />
          <div className="modal__buttonWrapper">
            <button onClick={close} className="modal__button">
              {i18n.get('cancel')}
            </button>
            <button
              onClick={handleCreateClick}
              className="modal__button modal__button--positive"
            >
              {i18n.get('create')}
            </button>
          </div>
        </footer>
      </section>
    </Modal>
  );
};

export default CreateSeriesModal;

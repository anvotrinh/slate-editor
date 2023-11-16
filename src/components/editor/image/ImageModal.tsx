import React, { useCallback, useEffect, useRef } from 'react';
import Dropzone from 'react-dropzone';
import cx from 'classnames';
import { useSlateStatic } from 'slate-react';
import Modal from '../../modal';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { closeImageModal, openCoverImageCropModal } from '../../../store/modal';
import i18n from '../../../utils/i18n';
import ImageModalSearch from './ImageModalSearch';
import ImageModalContent from './ImageModalContent';
import {
  resetSearchResult,
  searchImages,
  StoreImage,
  uploadImage,
} from '../../../store/image';
import { AbortThunk } from '../../../store';
import { insertImages } from '../../../utils/image';
import { showAlertMessage, showConfirmMessage } from '../../../utils/common';

const ImageModal = (): JSX.Element => {
  const editor = useSlateStatic();
  const dispatch = useAppDispatch();
  const { isImageModalOpen } = useAppSelector((state) => state.modal);
  const { images, selectedImageIds, singleMode } = useAppSelector(
    (state) => state.image
  );
  const serverRequests = useRef<AbortThunk[]>([]);

  const handleSearchImages = useCallback(
    async (shouldReset: boolean) => {
      const promise = dispatch(searchImages(shouldReset));
      serverRequests.current.push(promise);
      const resultAction = await promise;
      if (
        searchImages.rejected.match(resultAction) &&
        resultAction.error.name !== 'AbortError'
      ) {
        showAlertMessage('get_images_failed_message');
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (isImageModalOpen) {
      handleSearchImages(true);
      serverRequests.current = [];
      return;
    }
    serverRequests.current.forEach((serverRequest) => serverRequest.abort());
    serverRequests.current = [];
    dispatch(resetSearchResult());
  }, [dispatch, isImageModalOpen, handleSearchImages]);

  const handleDrop = async (files: File[]) => {
    const promises = files.map((file) => {
      const promise = dispatch(uploadImage(file));
      serverRequests.current.push(promise);
      return promise;
    });
    const resultActions = await Promise.all(promises);
    resultActions.find((action) => {
      const isError = uploadImage.rejected.match(action);
      if (isError && action.error.name !== 'AbortError') {
        showAlertMessage('upload_image_failed_message');
      }
      return isError;
    });
  };

  const close = () => {
    dispatch(closeImageModal());
  };

  const handleOKClick = () => {
    const isSomeUploading = images.some((image) => image.isLoading);
    if (
      isSomeUploading &&
      !showConfirmMessage('cancel_upload_submit_message')
    ) {
      return;
    }

    if (singleMode) {
      const selectedImage = images.find(
        (image) => image.id === selectedImageIds[0]
      );
      dispatch(openCoverImageCropModal(selectedImage ? selectedImage.url : ''));
      close();
      return;
    }
    const listImageData = selectedImageIds
      .map((id) => images.find((image) => image.id === id))
      .filter((image): image is StoreImage => !!image && !image.isLoading)
      .map(({ id, url: src, caption, url_w: naturalWidth }) => ({
        id,
        src,
        caption,
        naturalWidth,
      }));
    insertImages(editor, listImageData);

    close();
  };

  const handleCancelClick = () => {
    const isSomeUploading = images.some((image) => image.isLoading);
    if (
      isSomeUploading &&
      !showConfirmMessage('cancel_upload_confirmation_message')
    ) {
      return;
    }
    close();
  };

  // disabled if no image selected or every selected image are not uploaded
  const selectedUploadedCount = selectedImageIds.filter((id) => {
    const image = images.find((image) => image.id === id);
    return image ? !image.isLoading : false;
  }).length;
  const okBtnClass = cx({
    modal__button: true,
    'modal__button--positive': true,
    'modal__button--disabled': selectedUploadedCount === 0,
  });
  return (
    <Modal isOpen={isImageModalOpen} onClose={close}>
      <Dropzone onDrop={handleDrop} accept="image/*" noClick>
        {({ getRootProps, getInputProps, isDragActive, open }) => (
          <section
            {...getRootProps({
              className: 'modal__wrapper modal__wrapper--full',
            })}
          >
            <input {...getInputProps()} />
            <header className="modal__header">
              <h5 className="modal__title">{i18n.get('embed_images')}</h5>
            </header>
            <div className="modal__body modal__body--full">
              <div className="modal-editorImage">
                <div className="modal-editorImage__header">
                  <ImageModalSearch onSearch={handleSearchImages} />
                  <button
                    className="modal-editorImage__button"
                    type="button"
                    onClick={open}
                  >
                    {i18n.get('upload_new')}
                  </button>
                </div>
                <ImageModalContent
                  isDragActive={isDragActive}
                  onScrollNext={handleSearchImages}
                />
              </div>
            </div>
            <footer className="modal__footer">
              <div className="modal__buttonWrapper"></div>
              <div className="modal__buttonWrapper">
                <button
                  className="modal__button"
                  type="button"
                  onClick={handleCancelClick}
                >
                  {i18n.get('cancel')}
                </button>
                <button
                  className={okBtnClass}
                  type="button"
                  onClick={handleOKClick}
                >
                  {i18n.get('ok')}
                </button>
              </div>
            </footer>
          </section>
        )}
      </Dropzone>
    </Modal>
  );
};

export default ImageModal;

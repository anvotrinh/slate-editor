import React, { useEffect, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';

import Modal from '../modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { closeCoverImageCropModal } from '../../store/modal';
import i18n from '../../utils/i18n';
import {
  COVER_ASPECT,
  COVER_HEIGHT,
  COVER_WIDTH,
  cropImageAsync,
  getCropSettingAsync,
  ImageBlob,
  resizeImageAsync,
} from './utils';
import { showAlertMessage } from '../../utils/common';

type Props = {
  setImageBlob: (imageBlob: ImageBlob) => void;
};

const CoverImageCropModal = ({ setImageBlob }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { isCoverImageCropModalOpen, coverImageToBeCroppedUrl } =
    useAppSelector((state) => state.modal);
  const [cropSetting, setCropSetting] = useState<Crop>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    aspect: COVER_ASPECT,
    unit: '%',
  });
  const [imageSize, setImageSize] = useState<[number, number]>([0, 0]);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);

  useEffect(() => {
    if (!isCoverImageCropModalOpen || !coverImageToBeCroppedUrl) return;
    setIsLoadingImage(true);
    getCropSettingAsync(coverImageToBeCroppedUrl).then((res) => {
      const [cropSetting, width, height] = res;
      setIsLoadingImage(false);
      setCropSetting(cropSetting);
      setImageSize([width, height]);
    });
  }, [isCoverImageCropModalOpen, coverImageToBeCroppedUrl]);

  const handleOKClick = async () => {
    close();
    const [imageWidth, imageHeight] = imageSize;
    // to avoid cropping bug (after resize), have to use Crop with "percentage unit" for
    // ReactCrop props, and use Crop with "reverse percentage unit (px)" for resize process
    // note: cropPixel provided by react-image-crop also have bug
    const cropPixel: Crop = {
      unit: 'px',
      aspect: COVER_ASPECT,
      x: (cropSetting.x * imageWidth) / 100,
      y: (cropSetting.y * imageHeight) / 100,
      width: (cropSetting.width * imageWidth) / 100,
      height: (cropSetting.height * imageHeight) / 100,
    };

    try {
      const croppedImageBlob = await cropImageAsync(
        coverImageToBeCroppedUrl,
        cropPixel
      );
      const resizedImageBlob = await resizeImageAsync(
        croppedImageBlob.url,
        COVER_WIDTH,
        COVER_HEIGHT
      );
      setImageBlob(resizedImageBlob);
    } catch (e) {
      if (e === 'load_error') {
        showAlertMessage('load_image_failed_message');
        return;
      }
      showAlertMessage('resize_image_failed_message');
    }
  };

  const close = () => {
    dispatch(closeCoverImageCropModal());
  };

  return (
    <Modal isOpen={isCoverImageCropModalOpen} onClose={close}>
      <section className="modal__wrapper">
        <header className="modal__header">
          <h5 className="modal__title">{i18n.get('crop_image')}</h5>
        </header>
        <div className="modal__body">
          <div className="modal-cropImage">
            <div className="modal-cropImage__wrapper">
              <ReactCrop
                src={coverImageToBeCroppedUrl}
                crop={cropSetting}
                onChange={(_, percentageCrop) => setCropSetting(percentageCrop)}
              />
            </div>
          </div>
        </div>
        <footer className="modal__footer">
          <div className="modal__buttonWrapper"></div>
          <div className="modal__buttonWrapper">
            <button className="modal__button" onClick={close} type="button">
              {i18n.get('cancel')}
            </button>
            <button
              className="modal__button modal__button--positive"
              disabled={isLoadingImage}
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

export default CoverImageCropModal;

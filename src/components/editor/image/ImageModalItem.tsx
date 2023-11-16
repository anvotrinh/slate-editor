import React, {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
} from 'react';
import cx from 'classnames';
import i18n from '../../../utils/i18n';
import {
  StoreImage,
  toggleImageSelected,
  deleteImage,
  updateCaptionLocal,
  updateImage,
} from '../../../store/image';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { showAlertMessage } from '../../../utils/common';

type Props = {
  image: StoreImage;
};

const ImageModalItem = ({ image }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { selectedImageIds, singleMode } = useAppSelector(
    (state) => state.image
  );

  const selectedIndex = selectedImageIds.indexOf(image.id);
  const selectedNumber = selectedIndex === -1 ? null : selectedIndex + 1;

  const handleItemClick = () => {
    if (image.isLoading) return;
    dispatch(toggleImageSelected(image.id));
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    const resultAction = await dispatch(deleteImage(image.id));
    if (deleteImage.rejected.match(resultAction)) {
      showAlertMessage(resultAction.payload);
    }
  };

  const handleTextAreaChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    dispatch(
      updateCaptionLocal({ imageId: image.id, caption: e.target.value })
    );
  };

  const handleTextAreaBlur: FocusEventHandler<HTMLTextAreaElement> = async (
    e
  ) => {
    const resultAction = await dispatch(
      updateImage({ imageId: image.id, caption: e.target.value })
    );
    if (updateImage.rejected.match(resultAction)) {
      showAlertMessage(resultAction.payload);
    }
  };

  const bgStyle = image.isLoading
    ? {}
    : {
        backgroundImage: `url(${image.thumb_360})`,
      };
  const liClass = cx({
    imageList__item: true,
    selected: selectedIndex !== -1,
    'single-mode': singleMode,
  });
  const imgClass = cx({
    imageList__imgWrapper: true,
    'imageList__imgWrapper--uploading': image.isLoading,
  });
  return (
    <li
      onClick={handleItemClick}
      className={liClass}
      data-selected-number={selectedNumber}
    >
      <div className={imgClass} style={bgStyle} />
      {image.isNew && (
        <button
          className="imageList__delete"
          type="button"
          disabled={image.isLoading}
          onClick={handleDeleteClick}
        >
          <i className="fa fa-times" aria-hidden="true"></i>
        </button>
      )}
      <div className="imageList__info">
        <textarea
          className="imageList__textarea"
          placeholder={i18n.get('caption')}
          name="caption"
          rows={3}
          maxLength={500}
          disabled={image.isLoading}
          onBlur={handleTextAreaBlur}
          onChange={handleTextAreaChange}
          onClick={(e) => e.stopPropagation()}
          value={image.caption}
        ></textarea>
      </div>
    </li>
  );
};

export default ImageModalItem;
